import re
import os
from datetime import datetime
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from sqlalchemy import func, extract, case
from models import db, Actividad, Foto, Region, Comuna, Tema, ContactarPor, Comentario
from werkzeug.utils import secure_filename
from math import ceil
import config

app = Flask(__name__)

EMAIL_REGEX = re.compile(r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
TEL_REGEX   = re.compile(r'^\+569\d{8}$')

app.config.from_object(config)


db.init_app(app)

@app.route('/api/localidades')
def api_localidades():
    regiones = Region.query.order_by(Region.id).all()
    result = []
    for r in regiones:
        comunas = Comuna.query.filter_by(region_id=r.id) \
                              .order_by(Comuna.id).all()
        result.append({
            'numero': r.id,
            'nombre': r.nombre,
            'comunas': [
                {'id': c.id, 'nombre': c.nombre}
                for c in comunas
            ]
        })
    return jsonify({'regiones': result})

@app.route('/ping')
def ping():
    count = Actividad.query.count()
    return f"Actividades en BD: {count}"


@app.route('/')
def index():
    ultimas = (
        Actividad.query
        .order_by(Actividad.id.desc()) 
        .limit(5)
        .all()
    )
    return render_template('index.html', actividades=ultimas)

@app.route('/api/actividades')
def api_actividades():
    page     = request.args.get('page', 1, type=int)
    per_page = 5

    total       = Actividad.query.count()
    total_pages = ceil(total / per_page)

    actividades = (
        Actividad.query
        .order_by(Actividad.id.desc())    
        .limit(per_page)
        .offset((page - 1) * per_page)
        .all()
    )

    result = []
    for a in actividades:
        tema_str = ', '.join([
            t.glosa_otro if t.tema == 'otro' and t.glosa_otro else t.tema
            for t in a.temas
        ]) if a.temas else ''

        result.append({
            'id': a.id,
            'inicio': a.dia_hora_inicio.isoformat(),
            'termino': a.dia_hora_termino.isoformat() if a.dia_hora_termino else None,
            'comuna': a.comuna.nombre,
            'sector': a.sector,
            'tema': tema_str,
            'organizador': a.nombre,
            'total_fotos': len(a.fotos),
        })

    return jsonify({
        'actividades': result,
        'page':         page,
        'total_pages':  total_pages
    })

@app.route('/api/actividades/<int:act_id>')
def api_actividad(act_id):
    a = Actividad.query.get_or_404(act_id)
    fotos = [
        {"ruta_archivo": f.ruta_archivo, "nombre_archivo": f.nombre_archivo}
        for f in a.fotos
    ]
    temas = [t.tema for t in a.temas]
    return jsonify({
        "id":          a.id,
        "inicio":      a.dia_hora_inicio.isoformat(),
        "termino":     a.dia_hora_termino.isoformat() if a.dia_hora_termino else None,
        "comuna":      a.comuna.nombre,
        "sector":      a.sector,
        "tema":        ", ".join(temas),
        "organizador": a.nombre,
        "email":       a.email,
        "celular":     a.celular,
        "contactar_por":contactos,
        "descripcion": a.descripcion,
        "fotos":       fotos
    })

@app.route('/actividades')
def listado():
    actividades = (
        Actividad.query
        .order_by(Actividad.dia_hora_inicio.desc())
        .all()
    )
    return render_template('listado.html', actividades=actividades)

@app.route('/actividades/<int:act_id>')
def detalle(act_id):
    actividad = Actividad.query.get_or_404(act_id)

    contactos = [
        f"{c.nombre} ({c.identificador})" if c.nombre == 'otra'
        else c.nombre
        for c in actividad.contactos
    ]

    return render_template(
        'listado_detalle.html',
        actividad     = actividad,
        contactos     = contactos
    )



@app.route('/estadisticas')
def estadisticas():
    return render_template('estadisticas.html')

@app.route('/api/stats/actividades_por_dia')
def stats_por_dia():
    rows = (
        db.session.query(
            func.date(Actividad.dia_hora_inicio).label('fecha'),
            func.count().label('cantidad')
        )
        .group_by('fecha')
        .order_by('fecha')
        .all()
    )
    return jsonify([
        { 'fecha': r.fecha.isoformat(), 'cantidad': r.cantidad }
        for r in rows
    ])

@app.route('/api/stats/actividades_por_tema')
def stats_por_tema():
    rows = (
        db.session.query(
            Tema.tema,
            func.count().label('cantidad')
        )
        .group_by(Tema.tema)
        .all()
    )
    return jsonify([
        { 'tema': r.tema, 'cantidad': r.cantidad }
        for r in rows
    ])

@app.route('/api/stats/actividades_por_horario')
def api_stats_por_horario():
    rows = (
        db.session.query(
            extract('month', Actividad.dia_hora_inicio).label('mes'),
            case(
                (extract('hour', Actividad.dia_hora_inicio) < 12, 'mañana'),
                (extract('hour', Actividad.dia_hora_inicio) < 18, 'mediodía'),
                else_='tarde'
            ).label('turno'),
            func.count().label('cantidad')
        )
        .group_by('mes', 'turno')
        .order_by('mes')
        .all()
    )
    return jsonify([
        {'mes': int(r.mes), 'turno': r.turno, 'cantidad': r.cantidad}
        for r in rows
    ])


@app.route('/api/comentarios/<int:act_id>')              # por defecto methods=['GET']
def api_get_comentarios(act_id):
    comentarios = (Comentario.query
                   .filter_by(actividad_id=act_id)
                   .order_by(Comentario.fecha.asc())
                   .all())
    return jsonify([
        {
          'id':    c.id,
          'nombre': c.nombre,
          'texto':  c.texto,
          'fecha':  c.fecha.isoformat()
        }
        for c in comentarios
    ])



@app.route('/api/comentarios/<int:act_id>', methods=['POST'])
def api_add_comentario(act_id):
    data   = request.get_json(silent=True) or request.form
    nombre = (data.get('nombre') or '').strip()
    texto  = (data.get('texto')  or '').strip()
    errors = []
    if not (3 <= len(nombre) <= 80):
        errors.append('Nombre debe tener entre 3 y 80 caracteres.')
    if len(texto) < 5:
        errors.append('Comentario debe tener al menos 5 caracteres.')
    if not Actividad.query.get(act_id):
        errors.append('Actividad no válida.')
    if errors:
        return jsonify({'errors': errors}), 400

    c = Comentario(nombre=nombre, texto=texto, actividad_id=act_id)
    db.session.add(c)
    db.session.commit()
    return jsonify({
        'id':     c.id,
        'nombre': c.nombre,
        'texto':  c.texto,
        'fecha':  c.fecha.isoformat()
    }), 201

temas_validos = [
    'música', 'deporte', 'ciencias', 'religión', 'política',
    'tecnología', 'juegos', 'baile', 'comida', 'otro'
]

@app.route('/informar', methods=['GET', 'POST'])
def informar():

    datos    = {}       
    medios   = []      
    tema_sel = ''       

    if request.method == 'POST':
        errors = []
    
        datos = request.form.to_dict(flat=True)
        medios   = request.form.getlist('contactar_por')
        tema_sel = datos.get('tema','')

        comuna_id = request.form.get('comuna_id', type=int)
        if not comuna_id:
            errors.append('Debes seleccionar una comuna.')
        if not datos.get('nombre','').strip():
            errors.append('El nombre del organizador es obligatorio.')
        if not datos.get('email','').strip():
            errors.append('El correo electrónico es obligatorio.')
        if not datos.get('dia_hora_inicio','').strip():
            errors.append('La fecha y hora de inicio es obligatoria.')
        if not datos.get('dia_hora_termino','').strip():
            errors.append('La fecha y hora de término es obligatoria.')
        if not tema_sel:
            errors.append('Debes seleccionar un tema.')
        if tema_sel == 'otro' and not datos.get('otro_tema','').strip():
            errors.append('Debes especificar el tema cuando eliges "Otro".')
            
        email = datos.get('email','').strip()
        if email and not EMAIL_REGEX.match(email):
            errors.append('El correo no tiene formato válido (usuario@dominio.com).')

        inicio_str  = datos.get('dia_hora_inicio','').strip()
        termino_str = datos.get('dia_hora_termino','').strip()
        try:
            inicio  = datetime.fromisoformat(inicio_str)
            termino = datetime.fromisoformat(termino_str)
            if termino <= inicio:
                errors.append('La fecha de término debe ser posterior a la de inicio.')
        except ValueError:
            errors.append('Las fechas deben tener formato válido (YYYY-MM-DDThh:mm).')

        celular = datos.get('celular','').strip()
        if celular and not TEL_REGEX.match(celular):
            errors.append('El número de celular debe tener formato +56912345678.')
            
        fotos_files = request.files.getlist('fotos[]')
        total_fotos = sum(1 for f in fotos_files if f and f.filename)
        if total_fotos < 1:
            errors.append('Debes subir al menos una foto.')
        if total_fotos > 5:
            errors.append('No puedes subir más de 5 fotos.')
            
        if errors:
            return render_template(
                'informar.html',
                errores=errors,
                datos=datos,
                medios=medios,
                tema_sel=tema_sel
            )
            
        sector      = datos.get('sector')
        nombre      = datos['nombre'].strip()
        email       = email
        celular     = celular
        descripcion = datos.get('descripcion')
        act = Actividad(
            comuna_id=comuna_id,
            sector=sector,
            nombre=nombre,
            email=email,
            celular=celular,
            dia_hora_inicio=inicio,
            dia_hora_termino=termino,
            descripcion=descripcion
        )
        db.session.add(act)
        db.session.flush()
        
        glosa_otro = datos.get('otro_tema', '').strip() if tema_sel == 'otro' else None
        tema_valido = tema_sel if tema_sel in temas_validos else 'otro'

        db.session.add(Tema(
            tema=tema_valido,
            glosa_otro=glosa_otro if tema_valido == 'otro' else None,
            actividad_id=act.id
        ))

            
        identificador = datos.get('id_contacto','').strip()
        for m in medios:
            iden = identificador if m == 'otra' else ''
            db.session.add(ContactarPor(
                actividad_id=act.id,
                nombre=m,
                identificador=iden
            ))
            
        upload_folder = app.config['UPLOAD_FOLDER']
        os.makedirs(upload_folder, exist_ok=True)
        for f in fotos_files:
            if f and f.filename:
                filename = secure_filename(f.filename)
                f.save(os.path.join(upload_folder, filename))
                db.session.add(Foto(
                    ruta_archivo=f'uploads/{filename}',
                    nombre_archivo=filename,
                    actividad_id=act.id
                ))

        db.session.commit()
        flash('Actividad registrada con éxito.', 'success')
        return redirect(url_for('index'))
        
    return render_template(
        'informar.html',
        errores=None,
        datos={},
        medios=[],
        tema_sel=''
    )



if __name__ == '__main__':
    app.run(debug=True)

from flask import Flask, render_template, request, redirect, url_for, flash
from models import db, Actividad, Region, Comuna, Foto
import config

app = Flask(__name__)
app.config.from_object(config)
db.init_app(app)

# (si usas create_all al inicio, déjalo aquí)


@app.route('/ping')
def ping():
    # Usamos el método count() del query de SQLAlchemy
    count = Actividad.query.count()
    return f"Actividades en BD: {count}"


@app.route('/')
def index():
    ultimas = Actividad.query \
                .order_by(Actividad.dia_hora_inicio.desc()) \
                .limit(5).all()
    return render_template('index.html', actividades=ultimas)

@app.route('/actividades')
def listado():
    return render_template('listado.html')

@app.route('/estadisticas')
def estadisticas():
    return render_template('estadisticas.html')

@app.route('/informar', methods=['GET', 'POST'])
def informar():
    if request.method == 'POST':
        region_id        = request.form.get('region_id', type=int)
        comuna_id        = request.form.get('comuna_id',  type=int)
        sector           = request.form.get('sector')
        nombre           = request.form.get('nombre')
        email            = request.form.get('email')
        celular          = request.form.get('celular')
        inicio_str       = request.form.get('dia_hora_inicio')
        termino_str      = request.form.get('dia_hora_termino')
        descripcion      = request.form.get('descripcion')
        fotos_files      = request.files.getlist('fotos')

        from datetime import datetime
        dia_hora_inicio = datetime.fromisoformat(inicio_str)
        dia_hora_termino = datetime.fromisoformat(termino_str) if termino_str else None

        act = Actividad(
            comuna_id=comuna_id,
            sector=sector,
            nombre=nombre,
            email=email,
            celular=celular,
            dia_hora_inicio=dia_hora_inicio,
            dia_hora_termino=dia_hora_termino,
            descripcion=descripcion
        )
        db.session.add(act)
        db.session.flush() 

        upload_folder = 'static/uploads'
        import os
        os.makedirs(upload_folder, exist_ok=True)
        for f in fotos_files:
            if f.filename:
                ruta = os.path.join(upload_folder, f.filename)
                f.save(ruta)
                foto = Foto(
                    ruta_archivo=ruta,
                    nombre_archivo=f.filename,
                    actividad_id=act.id
                )
                db.session.add(foto)

        db.session.commit()
        flash('Actividad registrada con éxito.', 'success')
        return redirect(url_for('index'))

    regiones = Region.query.order_by(Region.nombre).all()
    comunas  = Comuna.query.order_by(Comuna.nombre).all()
    return render_template('informar.html', regions=regiones, comunas=comunas)

if __name__ == '__main__':
    app.run(debug=True)


document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/stats/actividades_por_dia')
        .then(r => r.json())
        .then(data => {
            Highcharts.chart('chart1', {
                chart: { type: 'line' },
                title: { text: 'Actividades por Día' },
                xAxis: { categories: data.map(d => d.fecha) },
                yAxis: { title: { text: 'Cantidad' } },
                series: [{
                    name: 'Actividades',
                    data: data.map(d => d.cantidad)
                }]
            });
        });
    fetch('/api/stats/actividades_por_tema')
        .then(r => r.json())
        .then(data => {
            Highcharts.chart('chart2', {
                chart: { type: 'pie' },
                title: { text: 'Actividades por Tema' },
                series: [{
                    name: 'Total',
                    colorByPoint: true,
                    data: data.map(d => ({ name: d.tema, y: d.cantidad }))
                }]
            });
        });
    fetch('/api/stats/actividades_por_horario')
        .then(r => r.json())
        .then(data => {
            const meses = [...new Set(data.map(d => d.mes))].sort((a, b) => a - b);
            const turnos = ['mañana', 'mediodía', 'tarde'];
            const series = turnos.map(turno => ({
                name: turno,
                data: meses.map(m => {
                    const rec = data.find(d => d.mes === m && d.turno === turno);
                    return rec ? rec.cantidad : 0;
                })
            }));

            Highcharts.chart('chart3', {
                chart: { type: 'column' },
                title: { text: 'Actividades por Turno y Mes' },
                xAxis: { categories: meses.map(m => 'Mes ' + m) },
                yAxis: { title: { text: 'Cantidad' } },
                series: series
            });
        });

});

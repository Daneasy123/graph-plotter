
const table = document.getElementById('datatable').getElementsByTagName('tbody')[0];

// ADD NEW ROW IF LAST ONE IS FILLED
table.addEventListener('input', () => {
    const rows = table.rows;
    const lastrow = rows[rows.length - 1];
    const xinput = lastrow.cells[0].querySelector('input');
    const yinput = lastrow.cells[1].querySelector('input');

    if (xinput.value && yinput.value) {
        addrow();
    }
});

function addrow() {
    const newrow = table.insertRow();
    const xcell = newrow.insertCell(0);
    const ycell = newrow.insertCell(1);

    const xinput = document.createElement('input');
    xinput.type = 'number';
    xinput.step = 'any';

    const yinput = document.createElement('input');
    yinput.type = 'number';
    yinput.step = 'any';
    xcell.appendChild(xinput);
    ycell.appendChild(yinput);
}

function plotgraph() {
    const graphtype = document.getElementById("graphtype").value;
    const canvas = document.getElementById("graphcanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let points = [];
    const rows = table.rows;
    let rowCount = rows.length;
    // Ignore last row if both X and Y are empty
    if (rowCount > 0) {
        const lastX = rows[rowCount - 1].cells[0].querySelector('input').value;
        const lastY = rows[rowCount - 1].cells[1].querySelector('input').value;
        if (lastX === '' && lastY === '') {
            rowCount--;
        }
    }
    for (let i = 0; i < rowCount; i++) {
        const x = parseFloat(rows[i].cells[0].querySelector('input').value);
        const y = parseFloat(rows[i].cells[1].querySelector('input').value);
        if (!isNaN(x) && !isNaN(y)) {
            points.push({ x, y });
        }
    }

    if (points.length === 0) {
        // No data entered, do nothing
        return;
    }
    if (points.length < 2) {
        alert("Please enter at least two valid data points.");
        return;
    }

    if (graphtype === 'line') {
        points.sort((a, b) => a.x - b.x);
    }

    const padding = 40;
    const graphwidth = canvas.width - 2 * padding;
    const graphheight = canvas.height - 2 * padding;
    const xVals = points.map(p => p.x);
    const yVals = points.map(p => p.y);

    const xMin = Math.min(...xVals);
    const xMax = Math.max(...xVals);
    const yMin = Math.min(0, ...yVals);
    const yMax = Math.max(...yVals);

    const xscale = graphwidth / (xMax - xMin || 1);
    const yscale = graphheight / (yMax - yMin || 1);

    // axes of graph
    ctx.strokeStyle = "#999";
    ctx.lineWidth = 1;
    ctx.beginPath();
    // X axis
    ctx.moveTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);

    // Y axis
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.stroke();

    if (graphtype === 'line') {
        ctx.strokeStyle = "#007acc";
        ctx.lineWidth = 2;
        ctx.beginPath();

        points.forEach((point, i) => {
            const xcoord = padding + (point.x - xMin) * xscale;
            const ycoord = canvas.height - padding - (point.y - yMin) * yscale;

            if (i === 0) {
                ctx.moveTo(xcoord, ycoord);
            } else {
                ctx.lineTo(xcoord, ycoord);
            }
        });

        ctx.stroke();

        // Draw data points
        points.forEach(point => {
            const xcoord = padding + (point.x - xMin) * xscale;
            const ycoord = canvas.height - padding - (point.y - yMin) * yscale;
            ctx.fillStyle = "#ff3333";
            ctx.beginPath();
            ctx.arc(xcoord, ycoord, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
    }

    if (graphtype === 'bar') {
        const barwidth = Math.min(40, graphwidth / xVals.length - 10);

        points.forEach((point) => {
            const xcoord = padding + (point.x - xMin) * xscale - barwidth / 2;
            const ycoord = canvas.height - padding - (point.y - yMin) * yscale;
            const barheight = (point.y - yMin) * yscale;

            ctx.fillStyle = "#28a745";
            ctx.fillRect(xcoord, ycoord, barwidth, barheight);
        });
    }
}
window.addEventListener("resize", () => {
  if (window.innerWidth < 600) {
    document.body.style.backgroundColor = "#f0f8ff"; // light blue for small screens
  } else {
    document.body.style.backgroundColor = "#fff"; // white for larger screens
  }
});





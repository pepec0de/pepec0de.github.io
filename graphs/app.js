function parseAdjMatrix(input) {
    const rows = input.trim().split("\n");
    return rows.map(row => row.split(",").map(Number));
}

function calculateNodePositions(numNodes, canvasWidth, canvasHeight) {
    const radius = Math.min(canvasWidth, canvasHeight) / 2 - 20;
    const angleStep = (2 * Math.PI) / numNodes;
    const positions = [];

    for (let i = 0; i < numNodes; i++) {
        const angle = i * angleStep;
        const x = canvasWidth / 2 + radius * Math.cos(angle);
        const y = canvasHeight / 2 + radius * Math.sin(angle);
        positions.push({ x, y });
    }

    return positions;
}

function drawGraph() {
    const input = document.getElementById("adjMatrixInput").value;
    const adjMatrix = parseAdjMatrix(input);
    const canvas = document.getElementById("graphCanvas");
    const ctx = canvas.getContext("2d");
    const numNodes = adjMatrix.length;  
    const positions = calculateNodePositions(numNodes, canvas.width, canvas.height);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    ctx.strokeStyle = "#000";
    for (let i = 0; i < numNodes; i++) {
        for (let j = 0; j < numNodes; j++) {
            if (adjMatrix[i][j] === 1) {
                ctx.beginPath();
                ctx.moveTo(positions[i].x, positions[i].y);
                ctx.lineTo(positions[j].x, positions[j].y);
                ctx.stroke();
            }
        }
    }

    // Draw nodes
    ctx.fillStyle = "#00FFFF";
    for (let i = 0; i < numNodes; i++) {
        ctx.beginPath();
        ctx.arc(positions[i].x, positions[i].y, 10, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeText(i + 1, positions[i].x - 3, positions[i].y + 3);
    }
}
document.addEventListener('DOMContentLoaded', function() {
    console.log("--- Dashboard Script Initialization ---");
    console.log("¡Script.js se está ejecutando!");

    // PRUEBA DE REGISTRO DEL PLUGIN DATALABELS
    if (typeof Chart === 'undefined') {
        console.error("ERROR CRÍTICO: Chart.js no está cargado. Revisa tus etiquetas <script> en index.html.");
    } else {
        if (typeof ChartDataLabels === 'undefined') {
            console.error("ERROR CRÍTICO: chartjs-plugin-datalabels no está cargado. Revisa tus etiquetas <script> en index.html.");
        } else {
            try {
                Chart.register(ChartDataLabels);
                console.log("chartjs-plugin-datalabels registrado con éxito.");
            } catch (e) {
                console.error("Error al registrar chartjs-plugin-datalabels:", e);
            }
        }
    }

    // Datos de ejemplo ENRIQUECIDOS (con vehiclePlate, driverContact, nextMilestone, cargoType, weight, volume, history)
const allShipmentsData = [
    {
        id: 'TMS001',
        origin: 'Bogotá',
        originCoords: [4.7110, -74.0721], // Añade esta línea
        destination: 'Medellín',
        destinationCoords: [6.2442, -75.5812], // Añade esta línea
        status: 'En Curso',
        driver: 'Juan Pérez',
        driverContact: '3001234567',
        vehiclePlate: 'ABC-123',
        type: 'Carga General',
        estimatedDeliveryDate: '2025-06-20',
        weight: '2.5 Ton',
        volume: '15 m³',
        lastUpdate: '2025-06-17 10:30',
        currentCoords: [5.2, -74.8], // Añade esta línea (ub. actual)
        routeProgress: 60,
        history: [
            { timestamp: '2025-06-17 08:00', description: 'Salida de Bogotá' },
            { timestamp: '2025-06-17 10:30', description: 'En tránsito - Honda, Tolima' }
        ],
        nextMilestone: 'Llegada a Medellín',
        deviationStatus: 'Normal'
    },

    {
        id: 'TMS002',
        origin: 'Cali',
        originCoords: [4.7110, -74.0721], // Añade esta línea
        destination: 'Barranquilla',
        destinationCoords: [6.2442, -75.5812], // Añade esta línea
        status: 'Pendiente',
        driver: 'Miguel Torres',
        driverContact: '3045678901',
        vehiclePlate: 'DEF-456',
        type: 'Carga General',
        estimatedDeliveryDate: '2025-06-20',
        weight: '2.5 Ton',
        volume: '15 m³',
        lastUpdate: '2025-06-17 10:30',
        currentCoords: [5.2, -74.8], // Añade esta línea (ub. actual)
        routeProgress: 60,
        history: [
            { timestamp: '2025-06-17 08:00', description: 'Salida de Bogotá' },
            { timestamp: '2025-06-17 10:30', description: 'En tránsito - Honda, Tolima' }
        ],
        nextMilestone: 'Llegada a Medellín',
        deviationStatus: 'Normal'

}];

    const allVehiclesData = [
        { id: 'VEH001', plate: 'ABC-123', model: 'Kenworth T680', capacity: '15.0 Ton', status: 'En Tránsito', lastMaintenance: '2025-05-01', mileage: '180000 km' },
        { id: 'VEH002', plate: 'DEF-456', model: 'Freightliner Cascadia', capacity: '20.0 Ton', status: 'Disponible', lastMaintenance: '2025-06-10', mileage: '220000 km' },
        { id: 'VEH003', plate: 'GHI-789', model: 'Hino Serie 500', capacity: '8.0 Ton', status: 'En Mantenimiento', lastMaintenance: '2025-06-17', mileage: '95000 km' },
        { id: 'VEH004', plate: 'JKL-012', model: 'International LT Series', capacity: '18.0 Ton', status: 'En Tránsito', lastMaintenance: '2025-05-20', mileage: '160000 km' },
        { id: 'VEH005', plate: 'MNO-345', model: 'Chevrolet NPR', capacity: '5.0 Ton', status: 'Disponible', lastMaintenance: '2025-06-05', mileage: '70000 km' },
        { id: 'VEH006', plate: 'PQR-678', model: 'Scania R Series', capacity: '25.0 Ton', status: 'En Tránsito', lastMaintenance: '2025-05-15', mileage: '300000 km' }
    ];

    // --- Referencias a elementos del DOM ---
    const shipmentsTableBody = document.getElementById('shipmentsTableBody');
    const statusFilter = document.getElementById('statusFilter');
    const searchInput = document.getElementById('searchInput');
    const newShipmentBtn = document.getElementById('newShipmentBtn');
    const newShipmentModal = document.getElementById('newShipmentModal');
    const closeNewShipmentModalBtn = document.getElementById('closeNewShipmentModalBtn');
    const newShipmentForm = document.getElementById('newShipmentForm');
    const dashboardModules = document.querySelectorAll('.dashboard-module');
    const navButtons = document.querySelectorAll('.nav-button');

    // Elementos del panel de detalles
    const detailPanel = document.getElementById('detailPanel');
    const closeDetailPanelBtn = document.getElementById('closeDetailPanelBtn');
    const detailShipmentId = document.getElementById('detailShipmentId');
    const detailOrigin = document.getElementById('detailOrigin');
    const detailDestination = document.getElementById('detailDestination');
    const detailStatus = document.getElementById('detailStatus');
    const detailCargoType = document.getElementById('detailCargoType');
    const detailWeight = document.getElementById('detailWeight');
    const detailVolume = document.getElementById('detailVolume');
    const detailDriver = document.getElementById('detailDriver');
    const detailDriverContact = document.getElementById('detailDriverContact');
    const detailVehiclePlate = document.getElementById('detailVehiclePlate');
    const detailShipmentDate = document.getElementById('detailShipmentDate');
    const detailEstimatedDelivery = document.getElementById('detailEstimatedDelivery');
    const detailLastUpdate = document.getElementById('detailLastUpdate');
    const detailNextMilestone = document.getElementById('detailNextMilestone');
    const detailRouteProgressBar = document.getElementById('detailRouteProgressBar');
    const detailRouteProgressText = document.getElementById('detailRouteProgressText');
    const detailDeviationStatus = document.getElementById('detailDeviationStatus');
    const detailHistoryList = document.getElementById('detailHistoryList');
    const actionUpdateStatus = document.getElementById('actionUpdateStatus');
    const actionContactDriver = document.getElementById('actionContactDriver');
    const actionViewDocuments = document.getElementById('actionViewDocuments');
    const actionViewOnMapBtn = document.getElementById('actionViewOnMap');


    // Referencias para el módulo de Flota
    const totalVehicles = document.getElementById('totalVehicles');
    const vehiclesOnRoute = document.getElementById('vehiclesOnRoute');
    const vehiclesAvailable = document.getElementById('vehiclesAvailable');
    const vehiclesMaintenance = document.getElementById('vehiclesMaintenance');
    const fleetTableBody = document.getElementById('fleetTableBody');
    const fleetStatusFilter = document.getElementById('fleetStatusFilter');
    const fleetSearchInput = document.getElementById('fleetSearchInput');
    const newVehicleBtn = document.getElementById('newVehicleBtn');
    const newVehicleModal = document.getElementById('newVehicleModal');
    const closeNewVehicleModalBtn = document.getElementById('closeNewVehicleModalBtn');
    const newVehicleForm = document.getElementById('newVehicleForm');

    // --- Referencias para el módulo de Informes ---
    const reportTypeSelect = document.getElementById('reportType');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const generateReportBtn = document.getElementById('generateReportBtn');
    const exportReportBtn = document.getElementById('exportReportBtn');
    const reportsSummaryTableBody = document.getElementById('reportsSummaryTableBody');


    // --- Variables para Chart.js ---
    let mainMap;
    let mapMarkers = {};
    const mapPolylines = {};
    let shipmentChart, originDestinationChart, shipmentTrendChart, fleetStatusChart;
    let routePerformanceChart, onTimeDeliveryChart, fuelEfficiencyChart, costliestRoutesChart; // Nuevos gráficos de informes

    // --- Funciones para la Gestión de Módulos (Tabs) ---
    function showModule(moduleId) {
        dashboardModules.forEach(module => {
            module.classList.remove('active');
        });
        document.getElementById(moduleId).classList.add('active');

        // Actualizar botón de navegación activo
        navButtons.forEach(button => {
            if (button.dataset.module === moduleId) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });

        // Lógica específica para cada módulo al mostrarse
        if (moduleId === 'dashboard-overview') {
            updateShipmentsTable(allShipmentsData);
            createShipmentStatusChart();
            createOriginDestinationChart();
            createShipmentTrendChart();
            createFleetStatusChart();
            // Asegurarse de que el mapa se invalida cuando el módulo del dashboard es activo
            if (mainMap) {
                setTimeout(() => mainMap.invalidateSize(), 0);
            }
        } else if (moduleId === 'fleet-management') {
            updateFleetKpis();
            updateFleetTable(allVehiclesData);
            // Si hay gráficos específicos de flota que no son el principal, inicializarlos aquí
        } else if (moduleId === 'reports-analytics') {
            // Inicializar o actualizar los gráficos de informes al mostrar la pestaña
            initializeReportsData(); // Cargar datos iniciales o generar un informe por defecto
            createRoutePerformanceChart();
            createOnTimeDeliveryChart();
            createFuelEfficiencyChart();
            createCostliestRoutesChart();
            updateReportsSummary(); // Actualizar la tabla de resumen
        }

        // Asegurarse de que el panel de detalles se cierre si está abierto
        closeDetailPanel();
    }

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const moduleId = button.dataset.module;
            showModule(moduleId);
        });
    });

    // --- Funciones de Gestión de Envíos (Dashboard) ---

    function renderShipments(shipments) {
        shipmentsTableBody.innerHTML = '';
        shipments.forEach(shipment => {
            const row = shipmentsTableBody.insertRow();
            row.dataset.shipmentId = shipment.id; // Almacenar ID para detalles
            row.innerHTML = `
                <td>${shipment.id}</td>
                <td>${shipment.origin}</td>
                <td>${shipment.destination}</td>
                <td class="status-${shipment.status.toLowerCase().replace(' ', '-')}">${shipment.status}</td>
                <td>${shipment.driver}</td>
                <td>${shipment.vehiclePlate || 'N/A'}</td>
                <td>${shipment.estimatedDeliveryDate}</td>
                <td>${shipment.weight}</td>
                <td>${shipment.volume}</td>
                <td>${shipment.lastUpdate}</td>
            `;
            row.addEventListener('click', () => openDetailPanel(shipment.id));
        });
    }

    function updateShipmentsTable() {
        const selectedStatus = statusFilter.value;
        const searchTerm = searchInput.value.toLowerCase();

        let filteredShipments = allShipmentsData.filter(shipment => {
            const matchesStatus = selectedStatus === 'Todos' || shipment.status === selectedStatus;
            const matchesSearch = Object.values(shipment).some(value =>
                String(value).toLowerCase().includes(searchTerm)
            );
            return matchesStatus && matchesSearch;
        });
        renderShipments(filteredShipments);
    }

    // --- Gestión del Modal de Nuevo Envío ---
    newShipmentBtn.addEventListener('click', () => {
        newShipmentForm.reset(); // Limpia el formulario
        newShipmentModal.style.display = 'flex';
    });

    closeNewShipmentModalBtn.addEventListener('click', () => {
        newShipmentModal.style.display = 'none';
    });

    newShipmentModal.addEventListener('click', (e) => {
        if (e.target === newShipmentModal) {
            newShipmentModal.style.display = 'none';
        }
    });

    newShipmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newShipment = {
            id: document.getElementById('newShipmentId').value,
            origin: document.getElementById('newShipmentOrigin').value,
            destination: document.getElementById('newShipmentDestination').value,
            status: document.getElementById('newShipmentStatus').value,
            driver: document.getElementById('newShipmentDriver').value,
            vehiclePlate: document.getElementById('newShipmentVehiclePlate').value,
            cargoType: document.getElementById('newShipmentCargoType').value,
            weight: document.getElementById('newShipmentWeight').value + ' Ton',
            volume: document.getElementById('newShipmentVolume').value + ' m³',
            estimatedDeliveryDate: document.getElementById('newShipmentEstimatedDeliveryDate').value,
            lastUpdate: new Date().toLocaleString(),
            nextMilestone: 'Recién creado',
            progress: 0,
            history: [{ timestamp: new Date().toLocaleString(), event: 'Envío creado' }]
        };

        allShipmentsData.push(newShipment);
        updateShipmentsTable();
        createShipmentStatusChart(); // Actualizar gráficos de dashboard
        createOriginDestinationChart();
        createShipmentTrendChart();
        createFleetStatusChart(); // Podría afectar la flota si el vehículo es nuevo/cambia estado
        newShipmentModal.style.display = 'none';
        alert('Nuevo envío agregado con éxito!');
    });


    // --- Funciones del Panel de Detalles ---
    function openDetailPanel(shipmentId) {
        const shipment = allShipmentsData.find(s => s.id === shipmentId);
        if (shipment) {
            detailShipmentId.textContent = shipment.id;
            detailOrigin.textContent = shipment.origin;
            detailDestination.textContent = shipment.destination;
            detailStatus.textContent = shipment.status;
            detailStatus.className = `status-${shipment.status.toLowerCase().replace(' ', '-')}`; // Aplica clase de estado
            detailCargoType.textContent = shipment.cargoType || 'No especificado';
            detailWeight.textContent = shipment.weight;
            detailVolume.textContent = shipment.volume;
            detailDriver.textContent = shipment.driver;
            detailDriverContact.textContent = shipment.driverContact || 'N/A';
            detailVehiclePlate.textContent = shipment.vehiclePlate || 'N/A';
            detailShipmentDate.textContent = shipment.history[0]?.timestamp.split(' ')[0] || 'N/A';
            detailEstimatedDelivery.textContent = shipment.estimatedDeliveryDate;
            detailLastUpdate.textContent = shipment.lastUpdate;
            detailNextMilestone.textContent = shipment.nextMilestone;
            detailRouteProgressBar.style.width = `${shipment.progress}%`;
            detailRouteProgressText.textContent = `${shipment.progress}%`;
            detailDeviationStatus.textContent = shipment.progress < 100 && shipment.status !== 'Pendiente' ? 'Normal' : shipment.status === 'Entregado' ? 'Finalizado' : 'En curso';

            // Historial de Eventos
            detailHistoryList.innerHTML = '';
            if (shipment.history && shipment.history.length > 0) {
                shipment.history.forEach(event => {
                    const li = document.createElement('li');
                    li.textContent = `${event.timestamp}: ${event.event}`;
                    detailHistoryList.appendChild(li);
                });
            } else {
                const li = document.createElement('li');
                li.textContent = 'No hay historial de eventos disponible.';
                detailHistoryList.appendChild(li);
            }

            detailPanel.classList.add('open');
        }
    }

    function closeDetailPanel() {
        detailPanel.classList.remove('open');
    }

    closeDetailPanelBtn.addEventListener('click', closeDetailPanel);

    // Acciones del panel de detalles
    if (actionUpdateStatus) {
        actionUpdateStatus.addEventListener('click', () => {
            const currentShipmentId = detailShipmentId.textContent;
            const newStatus = prompt(`Actualizar estado para ${currentShipmentId}:`);
            if (newStatus) {
                const shipment = allShipmentsData.find(s => s.id === currentShipmentId);
                if (shipment) {
                    shipment.status = newStatus;
                    shipment.lastUpdate = new Date().toLocaleString();
                    shipment.history.push({ timestamp: shipment.lastUpdate, event: `Estado actualizado a: ${newStatus}` });
                    updateShipmentsTable();
                    openDetailPanel(currentShipmentId); // Reabrir para mostrar el estado actualizado
                    createShipmentStatusChart(); // Actualizar gráfico
                }
            }
        });
    }

    if (actionContactDriver) {
        actionContactDriver.addEventListener('click', () => {
            const currentDriverContact = detailDriverContact.textContent;
            alert(`Simulando: Llamando al conductor ${detailDriver.textContent} al ${currentDriverContact}`);
            // En un TMS real, esto podría integrar con un sistema de comunicación
        });
    }

    if (actionViewDocuments) {
        actionViewDocuments.addEventListener('click', () => {
            const currentShipmentId = detailShipmentId.textContent;
            alert(`Simulando: Abriendo documentos para el envío ${currentShipmentId}`);
        });
    }

    if (actionViewOnMapBtn) {
        actionViewOnMapBtn.addEventListener('click', () => {
            const currentShipmentId = detailShipmentId.textContent;
            const marker = mapMarkers[currentShipmentId];
            if (marker && mainMap) {
                // Asegurarse de que el módulo del dashboard esté visible antes de volar al mapa
                showModule('dashboard-overview');
                // Esperar un poco para que el mapa se haga visible y recalcule su tamaño
                setTimeout(() => {
                    mainMap.flyTo(marker.getLatLng(), 13); // Vuela a la ubicación del camión con zoom
                    marker.openPopup();
                    closeDetailPanel(); // Cerrar el panel después de volar al mapa
                }, 100); // Pequeño retraso para asegurar que el mapa se haya renderizado
            } else {
                alert('No se pudo encontrar el camión en el mapa para este envío.');
            }
        });
    }

    // --- Funciones para el Mapa (Leaflet) ---
    function initializeMap() {
        if (mainMap) {
            mainMap.remove(); // Elimina el mapa existente si ya fue inicializado
        }
        mainMap = L.map('dashboardMap').setView([4.5709, -74.2973], 6); // Centro de Colombia

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mainMap);

        updateMapMarkers(); // Agrega marcadores después de inicializar el mapa
    }

    function updateMapMarkers() {
        // Limpiar marcadores existentes
        for (const id in mapMarkers) {
            if (mapMarkers.hasOwnProperty(id)) {
                mainMap.removeLayer(mapMarkers[id]);
            }
        }
        // Reiniciar el objeto de marcadores
    Object.keys(mapMarkers).forEach(key => delete mapMarkers[key]);

    // <<-- AÑADE ESTE BLOQUE DE CÓDIGO PARA LIMPIAR POLILÍNEAS EXISTENTES -->>
    for (const id in mapPolylines) {
        if (mapPolylines.hasOwnProperty(id)) {
            shipmentsMap.removeLayer(mapPolylines[id]);
        }
    }
    Object.keys(mapPolylines).forEach(key => delete mapPolylines[key]);
    // <<-- FIN DEL BLOQUE A AÑADIR -->>

        // Elimina el bucle shipmentsToDisplay.forEach(shipment => { ... }) porque ya se está usando allShipmentsData.forEach
        allShipmentsData.forEach(shipment => {
            // Simular coordenadas aproximadas basadas en origen/destino para el ejemplo
            // En una aplicación real, usarías coordenadas GPS reales del vehículo
            let latlng;
            switch (shipment.status) {
                case 'En Curso':
                    latlng = getRandomLatLng(getCityLatLng(shipment.origin), getCityLatLng(shipment.destination));
                    break;
                case 'Pendiente':
                    latlng = getCityLatLng(shipment.origin); // Todavía en origen
                    break;
                case 'Entregado':
                    latlng = getCityLatLng(shipment.destination); // En destino
                    break;
                default:
                    latlng = [4.5709, -74.2973]; // Centro si no hay info
            }
    
            const marker = L.marker(latlng).addTo(mainMap)
                .bindPopup(`<b>${shipment.id}</b><br>${shipment.driver}<br>Estado: ${shipment.status}`)
                .on('click', () => openDetailPanel(shipment.id));
            mapMarkers[shipment.id] = marker;

            

            


        });


    }


    function getCityLatLng(cityName) {
        // Coordenadas aproximadas para ciudades colombianas
        const cities = {
            'Bogotá': [4.7110, -74.0721],
            'Medellín': [6.2442, -75.5812],
            'Cali': [3.4516, -76.5320],
            'Barranquilla': [10.9685, -74.7813],
            'Bucaramanga': [7.1198, -73.1227],
            'Cartagena': [10.3910, -75.4794],
            'Santa Marta': [11.2407, -74.1990],
            'Ibagué': [4.4389, -75.2322]
        };
        return cities[cityName] || [4.5709, -74.2973]; // Centro de Colombia por defecto
    }

    function getRandomLatLng(start, end) {
        // Simula un punto aleatorio entre origen y destino para 'En Curso'
        const lat = start[0] + (end[0] - start[0]) * Math.random();
        const lng = start[1] + (end[1] - start[1]) * Math.random();
        return [lat, lng];
    }


    // --- Funciones para Gráficos (Chart.js) ---
    function createShipmentStatusChart() {
        if (shipmentChart) shipmentChart.destroy();
        const ctx = document.getElementById('shipmentStatusChart').getContext('2d');

        const statusCounts = allShipmentsData.reduce((acc, shipment) => {
            acc[shipment.status] = (acc[shipment.status] || 0) + 1;
            return acc;
        }, {});

        const labels = Object.keys(statusCounts);
        const data = Object.values(statusCounts);
        const backgroundColors = [
            'rgba(0, 123, 255, 0.7)', // En Curso (primary)
            'rgba(40, 167, 69, 0.7)', // Entregado (accent)
            'rgba(220, 53, 69, 0.7)', // Pendiente (danger)
            'rgba(255, 193, 7, 0.7)' // Otros/Advertencia
        ];

        shipmentChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColors.slice(0, labels.length),
                    borderColor: '#333',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: 'var(--text-color)'
                        }
                    },
                    datalabels: {
                        color: '#fff',
                        formatter: (value, context) => {
                            const total = context.chart.data.datasets[0].data.reduce((sum, current) => sum + current, 0);
                            const percentage = ((value / total) * 100).toFixed(1) + '%';
                            return percentage;
                        }
                    },
                    title: {
                        display: false, // Título ya en HTML
                    }
                }
            }
        });
    }

    function createOriginDestinationChart() {
        if (originDestinationChart) originDestinationChart.destroy();
        const ctx = document.getElementById('originDestinationChart').getContext('2d');

        const routeCounts = {};
        allShipmentsData.forEach(shipment => {
            const route = `${shipment.origin} - ${shipment.destination}`;
            routeCounts[route] = (routeCounts[route] || 0) + 1;
        });

        // Ordenar rutas por frecuencia y tomar las top 5
        const sortedRoutes = Object.entries(routeCounts).sort(([, a], [, b]) => b - a).slice(0, 5);
        const labels = sortedRoutes.map(([route,]) => route);
        const data = sortedRoutes.map(([, count]) => count);

        originDestinationChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Número de Envíos',
                    data: data,
                    backgroundColor: 'rgba(255, 193, 7, 0.7)', // warning-color
                    borderColor: 'rgba(255, 193, 7, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y', // Hace el gráfico de barras horizontal
                plugins: {
                    legend: {
                        display: false
                    },
                    datalabels: {
                        color: '#fff',
                        anchor: 'end',
                        align: 'end'
                    },
                    title: {
                        display: false,
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: { color: 'var(--text-color)' },
                        grid: { color: 'var(--border-color)' }
                    },
                    y: {
                        ticks: { color: 'var(--text-color)' },
                        grid: { color: 'var(--border-color)' }
                    }
                }
            }
        });
    }

    function createShipmentTrendChart() {
        if (shipmentTrendChart) shipmentTrendChart.destroy();
        const ctx = document.getElementById('shipmentTrendChart').getContext('2d');

        const monthlyData = {};
        const today = new Date();
        // Generar etiquetas para los últimos 6 meses
        const sixMonthsAgo = new Date(today.setMonth(today.getMonth() - 5)); // Ajuste para incluir el mes actual
        let currentMonth = new Date(sixMonthsAgo);
        const monthLabels = [];
        for (let i = 0; i < 6; i++) {
            const year = currentMonth.getFullYear();
            const month = currentMonth.getMonth() + 1; // getMonth() es 0-index
            const monthYearKey = `${year}-${String(month).padStart(2, '0')}`;
            monthLabels.push(currentMonth.toLocaleString('es-ES', { month: 'short', year: '2-digit' }));
            monthlyData[monthYearKey] = 0; // Inicializar en 0
            currentMonth.setMonth(currentMonth.getMonth() + 1);
        }

        allShipmentsData.forEach(shipment => {
            const shipmentDate = new Date(shipment.lastUpdate);
            const year = shipmentDate.getFullYear();
            const month = shipmentDate.getMonth() + 1;
            const monthYearKey = `${year}-${String(month).padStart(2, '0')}`;
            if (monthlyData.hasOwnProperty(monthYearKey)) {
                monthlyData[monthYearKey]++;
            }
        });

        const data = Object.values(monthlyData);

        shipmentTrendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: monthLabels,
                datasets: [{
                    label: 'Número de Envíos',
                    data: data,
                    borderColor: 'var(--info-color)',
                    backgroundColor: 'rgba(23, 162, 184, 0.2)', // info-color con transparencia
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    datalabels: {
                        display: false // No mostrar datalabels en líneas si no se quiere saturar
                    },
                    title: {
                        display: false,
                    }
                },
                scales: {
                    x: {
                        ticks: { color: 'var(--text-color)' },
                        grid: { color: 'var(--border-color)' }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: 'var(--text-color)',
                            precision: 0 // No decimales para el conteo
                        },
                        grid: { color: 'var(--border-color)' }
                    }
                }
            }
        });
    }

    function createFleetStatusChart() {
        if (fleetStatusChart) fleetStatusChart.destroy();
        const ctx = document.getElementById('fleetStatusChart').getContext('2d');

        const statusCounts = allVehiclesData.reduce((acc, vehicle) => {
            acc[vehicle.status] = (acc[vehicle.status] || 0) + 1;
            return acc;
        }, {});

        const labels = Object.keys(statusCounts);
        const data = Object.values(statusCounts);
        const backgroundColors = [
            'rgba(40, 167, 69, 0.7)',  // Disponible (accent)
            'rgba(0, 123, 255, 0.7)',  // En Tránsito (primary)
            'rgba(255, 193, 7, 0.7)'   // En Mantenimiento (warning)
        ];

        fleetStatusChart = new Chart(ctx, {
            type: 'pie', // O 'doughnut'
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColors.slice(0, labels.length),
                    borderColor: '#333',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: 'var(--text-color)'
                        }
                    },
                    datalabels: {
                        color: '#fff',
                        formatter: (value, context) => {
                            const total = context.chart.data.datasets[0].data.reduce((sum, current) => sum + current, 0);
                            const percentage = ((value / total) * 100).toFixed(1) + '%';
                            return percentage;
                        }
                    },
                    title: {
                        display: false,
                    }
                }
            }
        });
    }

    // --- Funciones de Gestión de Flota ---
    function updateFleetKpis() {
        const total = allVehiclesData.length;
        const onRoute = allVehiclesData.filter(v => v.status === 'En Tránsito').length;
        const available = allVehiclesData.filter(v => v.status === 'Disponible').length;
        const maintenance = allVehiclesData.filter(v => v.status === 'En Mantenimiento').length;

        totalVehicles.textContent = total;
        vehiclesOnRoute.textContent = onRoute;
        vehiclesAvailable.textContent = available;
        vehiclesMaintenance.textContent = maintenance;
    }

    function renderFleet(vehicles) {
        fleetTableBody.innerHTML = '';
        vehicles.forEach(vehicle => {
            const row = fleetTableBody.insertRow();
            row.innerHTML = `
                <td>${vehicle.id}</td>
                <td>${vehicle.plate}</td>
                <td>${vehicle.model}</td>
                <td>${vehicle.capacity}</td>
                <td class="status-${vehicle.status.toLowerCase().replace(' ', '-')}">${vehicle.status}</td>
                <td>${vehicle.lastMaintenance || 'N/A'}</td>
                <td>${vehicle.mileage}</td>
            `;
            // Podrías añadir un evento click para ver detalles del vehículo si tuvieras un sidebar de vehículos
        });
    }

    function updateFleetTable() {
        const selectedStatus = fleetStatusFilter.value;
        const searchTerm = fleetSearchInput.value.toLowerCase();

        let filteredVehicles = allVehiclesData.filter(vehicle => {
            const matchesStatus = selectedStatus === 'Todos' || vehicle.status === selectedStatus;
            const matchesSearch = Object.values(vehicle).some(value =>
                String(value).toLowerCase().includes(searchTerm)
            );
            return matchesStatus && matchesSearch;
        });
        renderFleet(filteredVehicles);
    }

    // --- Gestión del Modal de Nuevo Vehículo ---
    newVehicleBtn.addEventListener('click', () => {
        newVehicleForm.reset();
        newVehicleModal.style.display = 'flex';
    });

    closeNewVehicleModalBtn.addEventListener('click', () => {
        newVehicleModal.style.display = 'none';
    });

    newVehicleModal.addEventListener('click', (e) => {
        if (e.target === newVehicleModal) {
            newVehicleModal.style.display = 'none';
        }
    });

    newVehicleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newVehicle = {
            id: document.getElementById('newVehicleId').value,
            plate: document.getElementById('newVehiclePlate').value,
            model: document.getElementById('newVehicleModel').value,
            capacity: document.getElementById('newVehicleCapacity').value + ' Ton',
            status: document.getElementById('newVehicleStatus').value,
            lastMaintenance: document.getElementById('newVehicleLastMaintenance').value,
            mileage: document.getElementById('newVehicleMileage').value + ' km'
        };

        allVehiclesData.push(newVehicle);
        updateFleetKpis();
        updateFleetTable();
        createFleetStatusChart(); // Actualizar el gráfico de estado de flota
        newVehicleModal.style.display = 'none';
        alert('Nuevo vehículo agregado con éxito!');
    });

    // --- Funciones para el Módulo de Informes ---

    // Datos simulados para informes (más complejos, adaptados a la simulación)
    const reportsData = {
        rendimientoRuta: [
            { route: 'Bogotá-Medellín', distanceKm: 420, avgSpeedKmH: 65, avgTimeHours: 6.5, incidents: 2 },
            { route: 'Cali-Barranquilla', distanceKm: 1000, avgSpeedKmH: 70, avgTimeHours: 14, incidents: 0 },
            { route: 'Medellín-Bucaramanga', distanceKm: 400, avgSpeedKmH: 60, avgTimeHours: 6.8, incidents: 1 },
            { route: 'Bogotá-Cali', distanceKm: 300, avgSpeedKmH: 55, avgTimeHours: 5.5, incidents: 3 },
            { route: 'Barranquilla-Cartagena', distanceKm: 130, avgSpeedKmH: 75, avgTimeHours: 1.7, incidents: 0 }
        ],
        entregasTiempo: {
            onTime: 85, // Porcentaje
            delayed: 15,
            totalDeliveries: 120 // Número absoluto
        },
        eficienciaCombustible: [
            { vehicle: 'ABC-123', ltsPerKm: 0.35 },
            { vehicle: 'DEF-456', ltsPerKm: 0.30 },
            { vehicle: 'GHI-789', ltsPerKm: 0.45 }, // Este está en mantenimiento, simulamos que es menos eficiente
            { vehicle: 'JKL-012', ltsPerKm: 0.32 },
            { vehicle: 'MNO-345', ltsPerKm: 0.28 }
        ],
        costosOperacion: [
            { month: 'Enero', cost: 15000 },
            { month: 'Febrero', cost: 14500 },
            { month: 'Marzo', cost: 16000 },
            { month: 'Abril', cost: 15500 },
            { month: 'Mayo', cost: 17000 },
            { month: 'Junio', cost: 16200 }
        ]
    };

    function initializeReportsData() {
        // Establecer fechas por defecto (ej. último mes)
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);

        endDateInput.value = today.toISOString().split('T')[0];
        startDateInput.value = thirtyDaysAgo.toISOString().split('T')[0];

        // Generar un informe por defecto al cargar el módulo
        generateReport();
    }

    function generateReport() {
        const reportType = reportTypeSelect.value;
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;

        console.log(`Generando informe: ${reportType} desde ${startDate} hasta ${endDate}`);

        // Destruir gráficos anteriores antes de crear los nuevos
        if (routePerformanceChart) routePerformanceChart.destroy();
        if (onTimeDeliveryChart) onTimeDeliveryChart.destroy();
        if (fuelEfficiencyChart) fuelEfficiencyChart.destroy();
        if (costliestRoutesChart) costliestRoutesChart.destroy();

        // Lógica para mostrar/ocultar gráficos según el tipo de informe (o simplemente actualizar todos)
        // Por simplicidad, aquí los crearemos todos y la visibilidad la manejará Chart.js si los datos son 0/vacíos

        createRoutePerformanceChart();
        createOnTimeDeliveryChart();
        createFuelEfficiencyChart();
        createCostliestRoutesChart();
        updateReportsSummary(reportType);
    }

    function updateReportsSummary(reportType = reportTypeSelect.value) {
        reportsSummaryTableBody.innerHTML = '';
        let summaryRows = [];

        if (reportType === 'rendimientoRuta') {
            const totalDistance = reportsData.rendimientoRuta.reduce((sum, r) => sum + r.distanceKm, 0);
            const avgSpeed = (reportsData.rendimientoRuta.reduce((sum, r) => sum + r.avgSpeedKmH, 0) / reportsData.rendimientoRuta.length).toFixed(1);
            const totalIncidents = reportsData.rendimientoRuta.reduce((sum, r) => sum + r.incidents, 0);

            summaryRows.push(
                { metric: 'Distancia Total Recorrida', value: `${totalDistance} Km`, trend: 'N/A' },
                { metric: 'Velocidad Media', value: `${avgSpeed} Km/h`, trend: 'N/A' },
                { metric: 'Incidentes Reportados', value: totalIncidents, trend: totalIncidents > 5 ? '⬆️ Alto' : '⬇️ Bajo' }
            );
        } else if (reportType === 'entregasTiempo') {
            summaryRows.push(
                { metric: 'Entregas a Tiempo', value: `${reportsData.entregasTiempo.onTime}%`, trend: reportsData.entregasTiempo.onTime > 80 ? '⬆️ Bueno' : '⬇️ Regular' },
                { metric: 'Entregas Retrasadas', value: `${reportsData.entregasTiempo.delayed}%`, trend: reportsData.entregasTiempo.delayed < 10 ? '⬇️ Bajo' : '⬆️ Alto' },
                { metric: 'Total de Entregas', value: reportsData.entregasTiempo.totalDeliveries, trend: 'N/A' }
            );
        } else if (reportType === 'eficienciaCombustible') {
            const avgLtsPerKm = (reportsData.eficienciaCombustible.reduce((sum, v) => sum + v.ltsPerKm, 0) / reportsData.eficienciaCombustible.length).toFixed(2);
            summaryRows.push(
                { metric: 'Consumo Medio (Lts/Km)', value: avgLtsPerKm, trend: avgLtsPerKm < 0.35 ? '⬇️ Eficiente' : '⬆️ Alto' }
            );
        } else if (reportType === 'costosOperacion') {
            const totalCost = reportsData.costosOperacion.reduce((sum, m) => sum + m.cost, 0);
            const avgCost = (totalCost / reportsData.costosOperacion.length).toFixed(0);
            summaryRows.push(
                { metric: 'Costo Total Operativo', value: `$${totalCost.toLocaleString()}`, trend: 'N/A' },
                { metric: 'Costo Promedio Mensual', value: `$${avgCost.toLocaleString()}`, trend: 'N/A' }
            );
        }

        summaryRows.forEach(row => {
            const tr = reportsSummaryTableBody.insertRow();
            tr.innerHTML = `
                <td>${row.metric}</td>
                <td>${row.value}</td>
                <td>${row.trend}</td>
            `;
        });
    }


    function createRoutePerformanceChart() {
        if (routePerformanceChart) routePerformanceChart.destroy();
        const ctx = document.getElementById('routePerformanceChart').getContext('2d');

        const labels = reportsData.rendimientoRuta.map(r => r.route);
        const dataDistance = reportsData.rendimientoRuta.map(r => r.distanceKm);
        const dataAvgSpeed = reportsData.rendimientoRuta.map(r => r.avgSpeedKmH);

        routePerformanceChart = new Chart(ctx, {
            type: 'bar', // Combinamos barras y línea
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Distancia (Km)',
                        data: dataDistance,
                        backgroundColor: 'rgba(0, 123, 255, 0.7)',
                        borderColor: 'rgba(0, 123, 255, 1)',
                        borderWidth: 1,
                        yAxisID: 'y',
                    },
                    {
                        label: 'Velocidad Media (Km/h)',
                        data: dataAvgSpeed,
                        type: 'line',
                        borderColor: 'rgba(255, 193, 7, 1)',
                        backgroundColor: 'rgba(255, 193, 7, 0.2)',
                        fill: false,
                        yAxisID: 'y1',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: 'var(--text-color)' }
                    },
                    datalabels: {
                        display: false // Demasiado denso para mostrar datalabels por defecto
                    },
                    title: { display: false }
                },
                scales: {
                    x: {
                        ticks: { color: 'var(--text-color)' },
                        grid: { color: 'var(--border-color)' }
                    },
                    y: { // Eje para Distancia
                        beginAtZero: true,
                        ticks: { color: 'var(--text-color)' },
                        grid: { color: 'var(--border-color)' },
                        title: {
                            display: true,
                            text: 'Distancia (Km)',
                            color: 'var(--text-color)'
                        }
                    },
                    y1: { // Eje para Velocidad Media
                        type: 'linear',
                        display: true,
                        position: 'right',
                        beginAtZero: true,
                        ticks: { color: 'var(--text-color)' },
                        grid: { drawOnChartArea: false }, // No dibujar líneas de grid para este eje
                        title: {
                            display: true,
                            text: 'Velocidad (Km/h)',
                            color: 'var(--text-color)'
                        }
                    }
                }
            }
        });
    }

    function createOnTimeDeliveryChart() {
        if (onTimeDeliveryChart) onTimeDeliveryChart.destroy();
        const ctx = document.getElementById('onTimeDeliveryChart').getContext('2d');

        const data = reportsData.entregasTiempo;
        const labels = ['A Tiempo', 'Retrasadas'];
        const values = [data.onTime, data.delayed];
        const colors = [
            'rgba(40, 167, 69, 0.7)', // Accent (verde)
            'rgba(220, 53, 69, 0.7)'  // Danger (rojo)
        ];

        onTimeDeliveryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: colors,
                    borderColor: '#333',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: 'var(--text-color)'
                        }
                    },
                    datalabels: {
                        color: '#fff',
                        formatter: (value, context) => {
                            return value.toFixed(1) + '%';
                        }
                    },
                    title: { display: false }
                }
            }
        });
    }

    function createFuelEfficiencyChart() {
        if (fuelEfficiencyChart) fuelEfficiencyChart.destroy();
        const ctx = document.getElementById('fuelEfficiencyChart').getContext('2d');

        // Ordenar por eficiencia (menor es mejor)
        const sortedData = [...reportsData.eficienciaCombustible].sort((a, b) => a.ltsPerKm - b.ltsPerKm);
        const labels = sortedData.map(v => v.vehicle);
        const data = sortedData.map(v => v.ltsPerKm);

        fuelEfficiencyChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Litros por Kilómetro',
                    data: data,
                    backgroundColor: 'rgba(23, 162, 184, 0.7)', // Info (cian)
                    borderColor: 'rgba(23, 162, 184, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    datalabels: {
                        color: '#fff',
                        anchor: 'end',
                        align: 'end',
                        formatter: (value) => value.toFixed(2) // Mostrar 2 decimales
                    },
                    title: { display: false }
                },
                scales: {
                    x: {
                        ticks: { color: 'var(--text-color)' },
                        grid: { color: 'var(--border-color)' }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: { color: 'var(--text-color)' },
                        grid: { color: 'var(--border-color)' },
                        title: {
                            display: true,
                            text: 'Lts/Km',
                            color: 'var(--text-color)'
                        }
                    }
                }
            }
        });
    }

    function createCostliestRoutesChart() {
        if (costliestRoutesChart) costliestRoutesChart.destroy();
        const ctx = document.getElementById('costliestRoutesChart').getContext('2d');

        // Los datos de costos de operación son mensuales. Para "Top 5 Rutas Más Costosas",
        // usaré los datos de rendimiento de ruta e inventaré un costo por Km para simular.
        // En una app real, tendrías datos de costos reales por ruta/envío.

        const routesWithCosts = reportsData.rendimientoRuta.map(r => ({
            route: r.route,
            // Simulación de costo: distancia * factor de costo + costo base por incidente
            cost: (r.distanceKm * 0.5) + (r.incidents * 100) + (Math.random() * 50)
        }));

        const sortedRoutes = routesWithCosts.sort((a, b) => b.cost - a.cost).slice(0, 5);
        const labels = sortedRoutes.map(r => r.route);
        const data = sortedRoutes.map(r => r.cost);

        costliestRoutesChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Costo Estimado ($)',
                    data: data,
                    backgroundColor: 'rgba(255, 99, 132, 0.7)', // Un color rojo/rosa suave
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    datalabels: {
                        color: '#fff',
                        anchor: 'end',
                        align: 'end',
                        formatter: (value) => `$${value.toFixed(0)}` // Formato de moneda
                    },
                    title: { display: false }
                },
                scales: {
                    x: {
                        ticks: { color: 'var(--text-color)' },
                        grid: { color: 'var(--border-color)' }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: { color: 'var(--text-color)' },
                        grid: { color: 'var(--border-color)' },
                        title: {
                            display: true,
                            text: 'Costo ($)',
                            color: 'var(--text-color)'
                        }
                    }
                }
            }
        });
    }

    // Event Listeners para el módulo de Informes
    generateReportBtn.addEventListener('click', generateReport);
    reportTypeSelect.addEventListener('change', generateReport); // Regenerar al cambiar el tipo
    exportReportBtn.addEventListener('click', () => {
        const reportType = reportTypeSelect.value;
        alert(`Simulando: Exportando informe de ${reportType} a CSV.`);
        // Lógica real de exportación iría aquí
    });

    // Ajustar el mapa y los gráficos al redimensionar la ventana
    window.addEventListener('resize', () => {
        if (mainMap) {
            mainMap.invalidateSize();
        }
        // No es estrictamente necesario llamar a resize en Chart.js
        // si maintainAspectRatio es false y responsive es true,
        // pero no hace daño para asegurar.
        if (shipmentChart) shipmentChart.resize();
        if (originDestinationChart) originDestinationChart.resize();
        if (shipmentTrendChart) shipmentTrendChart.resize();
        if (fleetStatusChart) fleetStatusChart.resize();

        // Redimensionar los gráficos de informes también
        if (routePerformanceChart) routePerformanceChart.resize();
        if (onTimeDeliveryChart) onTimeDeliveryChart.resize();
        if (fuelEfficiencyChart) fuelEfficiencyChart.resize();
        if (costliestRoutesChart) costliestRoutesChart.resize();
    });


    // --- INICIALIZACIÓN AL CARGAR LA PÁGINA ---
    function initializeDashboard() {
        initializeMap(); // Inicializa el mapa solo una vez
        // Asegúrate de que los modales están ocultos al inicio.
        newShipmentModal.style.display = 'none';
        newVehicleModal.style.display = 'none';

        // Mostrar el módulo de Dashboard por defecto al cargar
        showModule('dashboard-overview'); // Inicia en el dashboard de resumen
    }

    // Llama a initializeDashboard() al final de DOMContentLoaded
    initializeDashboard();

    // Inicializar el filtro de envíos al cargar la página
    statusFilter.addEventListener('change', updateShipmentsTable);
    searchInput.addEventListener('input', updateShipmentsTable);

    // Inicializar el filtro de flota al cargar la página
    fleetStatusFilter.addEventListener('change', updateFleetTable);
    fleetSearchInput.addEventListener('input', updateFleetTable);
});
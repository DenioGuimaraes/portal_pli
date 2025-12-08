<link rel="stylesheet" href="css/u1640trip.css?v=<?php echo time(); ?>">

<div class="painel-cabecalho">
    <h2>U-1640 – Trips da Unidade</h2>
</div>

<!-- Wrap local do painel -->
<div class="u1640trip-wrap">

    <!-- Coluna esquerda -->
    <div class="u1640trip-col">
        <div class="u1640trip-card">
            <div class="u1640trip-card-header">Diagrama (clique para ampliar)</div>
            <div class="u1640trip-card-body u1640trip-imgbox">
                <img src="images/u1640_trip.jpg" alt="Diagrama Trip U-1640" 
                class="u1640trip-img" 
                onclick="PLI.viewer.exibir('u1640_trip.jpg')">
            </div>
        </div>
    </div>

    <!-- Coluna direita -->
    <div class="u1640trip-col">
        <div class="u1640trip-card">
            <div class="u1640trip-card-header">XCA-6401</div>
            <div class="u1640trip-card-body u1640trip-text">
                <ul>
                    <li>FS-6402: Vazão Baixa de Carga para o H-6401</li>
                    <li>FS-6418: Vazão Baixa de Hidrogênio na Descarga do C-6401</li>
                    <li>PS-6403: Pressão Alta de Gás Combustível</li>
                    <li>PS-6404: Pressão Baixa de Gás Combustível</li>
                    <li>Desarme Manual do H-6401</li>
                    <li>LS-6425: Nível Alto no Vaso de Gás Combustível (D-6407)</li>
                </ul>
            </div>
        </div>

        <div class="u1640trip-card">
            <div class="u1640trip-card-header">RESET</div>
            <div class="u1640trip-card-body u1640trip-text">
                <ul>
                    <li>Reset de Gás Combustível no painel:</li>
                    <li>Possibilita o Reset do Gás Combustível para os pilotos, na área. PB na área abre as SOV-6403 e 6404-B e fecha para a Atmosfera a SOV-6404-A.</li>
                    <li>Possibilita o Reset do Gás Combustível para os maçaricos, na área. PB na área fecha a SOV-6402 p/ Atmosfera e abre a SOV-6401, energizando a PICV-6401.</li>
                    <li>Reset de Gás Residual no Painel:</li>
                    <li>TRIP: Fecha a SOV-6406 para o H-6401 e abre a SOV-6405 para Flare.</li>
                    <li>RESET: Inverso do TRIP, possibilitando o rearme da SOV-6406, somente pela área.</li>
                </ul>
            </div>
        </div>
    </div>
</div>

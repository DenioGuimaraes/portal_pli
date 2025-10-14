<link rel="stylesheet" href="css/u1640steam.css?v=<?php echo time(); ?>">

<div class="painel-cabecalho">
    <h2>U-1640 - Steam Trace</h2>

    <div class="u1640steam-busca">
        <input type="text" id="u1640steamCampoBusca" placeholder="Buscar ..." onkeyup="u1640steamFiltrarBusca()">
    </div>
</div>

<div class="painel-conteudo">

    <!-- ==================== ESTAÇÕES DE ALIMENTAÇÃO GERAL ==================== -->
    <h2 class="u1640steam-grupo">Estações de Alimentação Geral</h2>

    <!-- SS-22 -->
    <div class="u1640steam-card">
        <h3>SS-22: TOPO DO R-6401-AB</h3>
        <table class="pessoal_table" border="2">
            <tr style="background-color: #888;text-align: center;">
                <td>Bloqueio</td><td>Trap</td><td>Tubulação</td>
            </tr>
            <tr><td>01</td><td>TS-29 T. 08</td><td>Linha de entrada R-6401-A</td></tr>
            <tr><td>02</td><td>Desativado</td><td>Desativado</td></tr>
        </table>
    </div>

    <!-- SS-23 -->
    <div class="u1640steam-card">
        <h3>SS-23: TOPO DA T-6401</h3>
        <table class="pessoal_table" border="2">
            <tr style="background-color: #888;text-align: center;">
                <td>Bloqueio</td><td>Trap</td><td>Tubulação</td>
            </tr>
            <tr><td>01</td><td>TS-32 T. 09-Leste</td><td>Linha D-6402 p/ D-6401 (Parcial)</td></tr>
            <tr><td>02</td><td>TS-29 T. 02</td><td>Linha da SOV-6406 até H-6401</td></tr>
            <tr><td>03</td><td>TS-31 T. 06</td><td>Linha do D-6404 até SOV-6406</td></tr>
            <tr><td>04</td><td>Trap Individual</td><td>Linha do D-6402 p/ T-6401 (Parcial)</td></tr>
            <tr><td>05</td><td>Trap Atmosférico</td><td>Linha de Hidrogênio p/ R-6401-A</td></tr>
        </table>
    </div>

    <!-- SS-24 -->
    <div class="u1640steam-card">
        <h3>SS-24: T-6402 (próximo FI-6410)</h3>
        <table class="pessoal_table" border="2">
            <tr style="background-color: #888;text-align: center;">
                <td>Bloqueio</td><td>Trap</td><td>Tubulação</td>
            </tr>
            <tr><td>01</td><td>TS-30 T. 06/09</td><td>Escorva das P’s-6402AB</td></tr>
            <tr><td>02</td><td>TS-29 T. 09</td><td>Saída do Vácuo T-6402 até J-6402</td></tr>
            <tr><td>03</td><td>TS-28 T. 07</td><td>LG superior do Sifão</td></tr>
            <tr><td>04</td><td>TS-28 T. 08</td><td>LG inferior do Sifão</td></tr>
            <tr><td>05</td><td>Trap Atmosférico</td><td>Linha de Hidrogênio p/ R-6401-A (Descendo)</td></tr>
        </table>
    </div>

    <!-- SS-25 -->
    <div class="u1640steam-card">
        <h3>SS-25: PLATAFORMA 1 (Oeste / T-6402 – Fundo)</h3>
        <table class="pessoal_table" border="2">
            <tr style="background-color: #888;text-align: center;">
                <td>Bloqueio</td><td>Trap</td><td>Tubulação</td>
            </tr>
            <tr><td>01</td><td>Desativado</td><td>Desativado</td></tr>
            <tr><td>02</td><td>TS-29 T. 12</td><td>LG da T-6402 e PI-6435</td></tr>
            <tr><td>03</td><td>TS-29 T. 13</td><td>LRC-6415</td></tr>
            <tr><td>04</td><td>TS-29 T. 07</td><td>FR-6401 e FS-6402</td></tr>
            <tr><td>05</td><td>Desativado</td><td>Desativado</td></tr>
        </table>
    </div>

    <!-- SS-26 -->
    <div class="u1640steam-card">
        <h3>SS-26: PLATAFORMA DOS EJETORES</h3>
        <table class="pessoal_table" border="2">
            <tr style="background-color: #888;text-align: center;">
                <td>Bloqueio</td><td>Trap</td><td>Tubulação</td>
            </tr>
            <tr><td>01</td><td>TS-32 T.08-Leste</td><td>Do D-6402 p/ E-6407 passando pela RV</td></tr>
            <tr><td>02</td><td>TS-32 T. 04-Oeste</td><td>PRCV-6433 até Duplo Bloqueio para Flare</td></tr>
            <tr><td>03</td><td>TS-32 T. 05-Oeste</td><td>Do E-6407 p/ D-6408</td></tr>
            <tr><td>04</td><td>TS-32 T. 06-Leste</td><td>Do E-6403 p/ D-6403</td></tr>
            <tr><td>05A</td><td>TS-31 T. 08</td><td>Fundo do D-6403 p/ D-6404</td></tr>
            <tr><td>05B</td><td>TS-32 T. 07-Oeste</td><td>D-6403 até D-6402</td></tr>
            <tr><td>05C</td><td>TS-32 T. 06-Oeste</td><td>D-6401 até D-6402 (Parafina Carga)</td></tr>
            <tr><td>06</td><td>TS-28 T. 04</td><td>D-6401 para E-6401 (Carga)</td></tr>
            <tr><td>07</td><td>TS-32 T. 04-Leste</td><td>LI-6403 Situado no D-6401</td></tr>
            <tr><td>08</td><td>TS-32 T. 05-Leste</td><td>LI-6402 no D-6401</td></tr>
            <tr><td>09</td><td>TS-32 T. 02-Leste</td><td>LG do D-6402</td></tr>
            <tr><td>10</td><td>TS-32 T. 03-Leste</td><td>LI-6404 no D-6402</td></tr>
            <tr><td>11</td><td>TS-32 T. 01-Leste</td><td>LS-6412 no D-6403</td></tr>
            <tr><td>12</td><td>TS-32 T. 02-Oeste</td><td>Fundo do D-6403, PI do D-6403/LS-6411</td></tr>
            <tr><td>13</td><td>TS-31 T. 07</td><td>Perna do E-6409 p/ D-6404</td></tr>
            <tr><td>14</td><td>TS-32 T. 03-Oeste</td><td>Da RV-6408 até o topo do D-6403</td></tr>
            <tr><td>15</td><td>TS-32 T. 01-Oeste</td><td>PICV-6430 até o topo do D-6408</td></tr>
            <tr><td>16</td><td>Trap Atmosférico prox. D-6407</td><td>Linha da PICV-6430 até D-6407</td></tr>
        </table>
    </div>

    <!-- SS-27 -->
    <div class="u1640steam-card">
        <h3>SS-27: PLATAFORMA DA T-6402 (FUNDO / LESTE)</h3>
        <table class="pessoal_table" border="2">
            <tr style="background-color: #888;text-align: center;">
                <td>Bloqueio</td><td>Trap</td><td>Tubulação</td>
            </tr>
            <tr><td>01</td><td>TS-30 T.05/08</td><td>Fundo da T-6402 até sucção da P-6402-AB</td></tr>
            <tr><td>02</td><td>TS-30 T. 07 e TS-30 T. 04</td><td>F-6402-W até Desc da P-6402-AB</td></tr>
            <tr><td>03</td><td>TS-29 T. 11</td><td>FRT-6411</td></tr>
            <tr><td>04</td><td>TS-28 T. 03</td><td>Saída do E-6402 para o E-6401</td></tr>
            <tr><td>05</td><td>TS-31 T. 10</td><td>Linha do D-6404 p/ U-1630 (G.R.)</td></tr>
        </table>
    </div>

    <!-- SS-28 -->
    <div class="u1640steam-card">
        <h3>SS-28: PICV-6430 (LESTE)</h3>
        <table class="pessoal_table" border="2">
            <tr style="background-color: #888;text-align: center;">
                <td>Bloqueio</td><td>Trap</td><td>Tubulação</td>
            </tr>
            <tr><td>01</td><td>Trap U-1630</td><td>G.R. do D-6404 p/ H-6301</td></tr>
            <tr><td>02</td><td>TS-31 T. 09</td><td>Fundo do D-6408 até o D-6404</td></tr>
            <tr><td>03</td><td>TS-32 T. 08-Oeste</td><td>LG do D-6408</td></tr>
            <tr><td>04</td><td>TS-32 T. 09-Oeste</td><td>LS do D-6408</td></tr>
        </table>
    </div>

    <!-- SS-29 (superior) -->
    <div class="u1640steam-card">
        <h3>SS-29: D-6409 (OESTE – SUPERIOR)</h3>
        <table class="pessoal_table" border="2">
            <tr style="background-color: #888;text-align: center;">
                <td>Bloqueio</td><td>Trap</td><td>Tubulação</td>
            </tr>
            <tr><td>01</td><td>TS-33 T. 06/07</td><td>Fundo do D-6409 até Sucção da P-6401AB</td></tr>
            <tr><td>02</td><td>TS-33 T. 03</td><td>LIC-6413 no D-6409</td></tr>
            <tr><td>03</td><td>TS-33 T. 04</td><td>LG do D-6409</td></tr>
            <tr><td>04</td><td>Desativado</td><td>Desativado</td></tr>
            <tr><td>05</td><td>Trap Individual</td><td>Próx. F-6406 –Trap 03 – Dreno dos F-6406-ABC</td></tr>
            <tr><td>06</td><td>Desativado</td><td>Desativado</td></tr>
        </table>
    </div>

    <!-- SS-29 (inferior) -->
    <div class="u1640steam-card">
        <h3>SS-29: D-6409 (OESTE – INFERIOR)</h3>
        <table class="pessoal_table" border="2">
            <tr style="background-color: #888;text-align: center;">
                <td>Bloqueio</td><td>Trap</td><td>Tubulação</td>
            </tr>
            <tr><td>01</td><td>TS-33 T. 01</td><td>Do D-6409 até F-6406-ABC</td></tr>
            <tr><td>02</td><td>TS-33 T. 02</td><td>Dos F-6406-ABC até D-6409</td></tr>
            <tr><td>03</td><td>TS-34 T. 01</td><td>Linha de Descarga da P-6405</td></tr>
        </table>
    </div>

    <!-- SS-30 -->
    <div class="u1640steam-card">
        <h3>SS-30: C-6401B (SUL)</h3>
        <table class="pessoal_table" border="2">
            <tr style="background-color: #888;text-align: center;">
                <td>Bloqueio</td><td>Trap</td><td>Tubulação</td>
            </tr>
            <tr><td>01</td><td>TS-36 T. 01</td><td>Linha de Partida – C-6401 até “U”</td></tr>
            <tr><td>02</td><td>TS-35 T. 01/05/06</td><td>D-6411 até sucção do C-6401-AB, PS-6487...</td></tr>
        </table>
    </div>

    <!-- SS-31 -->
    <div class="u1640steam-card">
        <h3>SS-31: PIPE-RACK (T-6202 NORTE)</h3>
        <table class="pessoal_table" border="2">
            <tr style="background-color: #888;text-align: center;">
                <td>Bloqueio</td><td>Trap</td><td>Tubulação</td>
            </tr>
            <tr><td>01</td><td>TS-34 T. 05 / TS-35 T. 07 / TS-38 T. 04</td><td>Parte da Linha de H2 do topo do D-6403...</td></tr>
            <tr><td>02A</td><td>TS-34 T. 04</td><td>F-6402-W, LRCV-6415, by-pass até entrada do E-6404</td></tr>
            <tr><td>02B</td><td>TS-29 T. 10</td><td>Descarga da P-6402-AB até o E-6404</td></tr>
            <tr><td>03A</td><td>TS-34 T. 04</td><td>Linha de Circulação do D-6409</td></tr>
            <tr><td>03B</td><td>TS-36 T. 03</td><td>Parte da linha p/ FIC-6409</td></tr>
            <tr><td>03C</td><td>TS-33 T. 10</td><td>D-6409 – FICV-6409</td></tr>
            <tr><td>04A</td><td>TS-33 T. 05/08</td><td>Da P-6401-AB até E-6401 (Parcial)</td></tr>
            <tr><td>04B</td><td>TS-28 T. 06</td><td>Da P-6401-AB até E-6401 (Parcial)</td></tr>
            <tr><td>05</td><td>TS-36 T. 02</td><td>Tomadas do FIC-6409</td></tr>
            <tr><td>06</td><td>TS-34 T. 04</td><td>Parte da linha de entrada no D-6404, E-6404</td></tr>
        </table>
    </div>

    <!-- SS-32 -->
    <div class="u1640steam-card">
        <h3>SS-32: PIPE-RACK (acima da P-6206B)</h3>
        <table class="pessoal_table" border="2">
            <tr style="background-color: #888;text-align: center;">
                <td>Bloqueio</td><td>Trap</td><td>Tubulação</td>
            </tr>
            <tr><td>01</td><td>TS-33 T. 09</td><td>Linha de Entr. no D-6409, LICV-6413</td></tr>
            <tr><td>02A</td><td>TS-28 T. 09</td><td>Da Check Valve até E-6401</td></tr>
            <tr><td>02B</td><td>TS-33 T. 12</td><td>Fundo do D-6409 até a check</td></tr>
            <tr><td>03</td><td>Trap Individual</td><td>Linha do D-6212 na U-1620</td></tr>
            <tr><td>04</td><td>TS-28 T. 05 / TS-29 T. 05</td><td>Do E-6401 p/ H-6401</td></tr>
        </table>
    </div>

    <!-- SS-33 -->
    <div class="u1640steam-card">
        <h3>SS-33: PIPE-RACK (D-6407-SUL)</h3>
        <table class="pessoal_table" border="2">
            <tr style="background-color: #888;text-align: center;">
                <td>Bloqueio</td><td>Trap</td><td>Tubulação</td>
            </tr>
            <tr><td>01</td><td>TS-34 T. 04</td><td>Do LB até o E-6404 – Parafina Produto</td></tr>
            <tr><td>02</td><td>TS-37 T. 06</td><td>Do LB até o meio da linha do TIE-IN 38</td></tr>
            <tr><td>03A</td><td>TS-37 T. 05</td><td>Paraf. do LB até o D-6409 e by-pass</td></tr>
            <tr><td>03B</td><td>TS-33 T. 11</td><td>Paraf. do LB até D-6409 Parcial</td></tr>
        </table>
    </div>

    <!-- SS-34 -->
    <div class="u1640steam-card">
        <h3>SS-34: PLATAFORMA DO D-6410</h3>
        <table class="pessoal_table" border="2">
            <tr style="background-color: #888;text-align: center;">
                <td>Bloqueio</td><td>Trap</td><td>Tubulação</td>
            </tr>
            <tr><td>01</td><td>TS-35 T. 02</td><td>RV-6420 – Sucção 2 est. C-6401-A</td></tr>
            <tr><td>02</td><td>TS-35 T. 04</td><td>RV-6419 – D-411</td></tr>
            <tr><td>03</td><td>TS-35 T. 03</td><td>RV-6421 – Sucção 2 est. C-6401-B</td></tr>
        </table>
    </div>

    <!-- ==================== ESTAÇÕES DE ALIMENTAÇÃO INDIVIDUAL ==================== -->
    <h2 class="u1640steam-grupo">Estações de Alimentação Individual</h2>
    <div class="u1640steam-card">
        <table class="pessoal_table" border="2">
            <tr style="background-color: #888;text-align: center;">
                <td>Equipamento</td><td>Trap</td>
            </tr>
            <tr><td>F-6406-ABC</td><td>TRAPS INDIVIDUAIS NA BASE DOS FILTROS...</td></tr>
            <tr><td>F-6405</td><td>TRAPS LOCALIZADOS NA BASE DO F-6405...</td></tr>
            <tr><td>D-6409</td><td>TRAP NA BASE DO VASO...</td></tr>
            <tr><td>D-6401</td><td>TRAP NA BASE DO VASO E BLOQUEIO EM CIMA...</td></tr>
            <tr><td>D-6402</td><td>TRAP NA BASE DO VASO, BLOQ. INDIVIDUAL EM CIMA...</td></tr>
            <tr><td>D-6404</td><td>BLOQ. GERAL AO SUL DO D-6404...</td></tr>
            <tr><td>T-6402</td><td>TRAP INDIVIDUAL NA BASE DA TORRE...</td></tr>
            <tr><td>E’s-6408/6409</td><td>BLOQ. A OESTE DO E-6408...</td></tr>
            <tr><td>E-6406</td><td>BLOQ. A OESTE DO TROCADOR...</td></tr>
            <tr><td>E-6405</td><td>BLOQ. A OESTE DO TROCADOR...</td></tr>
        </table>
    </div>

    <!-- ==================== ESTAÇÕES DE TRAP ==================== -->
    <h2 class="u1640steam-grupo">Estações de Trap</h2>
    <div class="u1640steam-card">
        <table class="pessoal_table" border="2">
            <tr style="background-color: #888;text-align: center;">
                <td>Estação</td><td>Localização</td>
            </tr>
            <tr><td>TS-28</td><td>D-6408 (NORTE)</td></tr>
            <tr><td>TS-29</td><td>PICV-6401 (SUL)</td></tr>
            <tr><td>TS-30</td><td>P-6402 (COL. OESTE)</td></tr>
            <tr><td>TS-31</td><td>D-6408 (OESTE)</td></tr>
            <tr><td>TS-32</td><td>D-6408 (SUL)</td></tr>
            <tr><td>TS-33</td><td>D-6409 (NORTE)</td></tr>
            <tr><td>TS-34</td><td>D-6405</td></tr>
            <tr><td>TS-35</td><td>C-6401-B (SUL – ALAMEDA)</td></tr>
            <tr><td>TS-36</td><td>P-6404 (SUL ALAMEDA)</td></tr>
            <tr><td>TS-37</td><td>COLUNA NO LB (NORTE)</td></tr>
            <tr><td>TS-38</td><td>D-6407 (SUDESTE)</td></tr>
        </table>
    </div>

    <!-- ==================== TRAPS PARA ATMOSFERA ==================== -->
    <h2 class="u1640steam-grupo">Traps para Atmosfera</h2>
    <div class="u1640steam-card">
        <table class="pessoal_table" border="2">
            <tr style="background-color: #888;text-align: center;">
                <td>Item</td><td>Descrição</td>
            </tr>
            <tr><td>01</td><td>LINHA DA PICV-6430 PARA O D-6407...</td></tr>
            <tr><td>02</td><td>LINHA DE DRENO DAS P’s-6401-AB...</td></tr>
            <tr><td>03</td><td>LINHA DE DRENO DA P-6401-A...</td></tr>
            <tr><td>04</td><td>LINHA DE SAÍDA DE H2 DO E-6402...</td></tr>
            <tr><td>05</td><td>LINHA DE VBP P/ TOPO DO REATOR...</td></tr>
            <tr><td>06</td><td>LINHA DE H2 P/ R-6401-A...</td></tr>
            <tr><td>07</td><td>LINHA DE VAPOR DE STRIPPER P/ T-6401...</td></tr>
            <tr><td>08</td><td>LINHA DE H2 P/ R-6401-A...</td></tr>
            <tr><td>09</td><td>LINHA DE VAPOR SUPERAQUECIDO P/ H-6301...</td></tr>
            <tr><td>10</td><td>LINHA DE AQUECIMENTO DA CARCAÇA DA P-6406...</td></tr>
            <tr><td>11</td><td>LINHA DE CARGA NO TOPO DO R-6401-A...</td></tr>
            <tr><td>12</td><td>LINHA DE H2 NO TOPO DO R-6401-A...</td></tr>
            <tr><td>13</td><td>LINHA DO R-6401-A P/ R-6401-B...</td></tr>
        </table>
    </div>

</div>

<script src="js/u1640steam.js?v=<?php echo time(); ?>"></script>

// Configurações
const API_URL = 'http://127.0.0.1:5000/classificar';

// Descrições para cada classe de vinho
const WINE_DESCRIPTIONS = {
    0: "Vinho do tipo Barolo: Um dos vinhos mais prestigiados da Itália, produzido na região do Piemonte com uvas Nebbiolo. Caracteriza-se por taninos robustos, acidez vibrante e aromas complexos de cereja, alcatrão e rosas.",
    1: "Vinho do tipo Grignolino: Típico do Piemonte, é um vinho de corpo leve a médio, com acidez refrescante e taninos suaves. Apresenta aromas de frutas vermelhas, notas florais e um final levemente amargo.",
    2: "Vinho do tipo Barbera: Também originário do Piemonte, é conhecido por sua acidez marcante, taninos suaves e sabores de frutas vermelhas maduras. Versátil e de fácil consumo, envelhece bem em barris de carvalho."
};

// Elementos do DOM
const wineForm = document.getElementById('wineForm');
const submitBtn = document.querySelector('.submit-btn');
const resultContainer = document.getElementById('result');
const predictionText = document.getElementById('predictionText');
const wineDescription = document.getElementById('wineDescription');

// Função para coletar dados do formulário
function getFormData() {
    return {
        alcohol: parseFloat(document.getElementById('alcohol').value),
        malic_acid: parseFloat(document.getElementById('malic_acid').value),
        ash: parseFloat(document.getElementById('ash').value),
        alcalinity_of_ash: parseFloat(document.getElementById('alcalinity').value),
        magnesium: parseInt(document.getElementById('magnesium').value),
        total_phenols: parseFloat(document.getElementById('phenols').value),
        flavanoids: parseFloat(document.getElementById('flavanoids').value),
        nonflavanoid_phenols: parseFloat(document.getElementById('nonflavanoids').value),
        proanthocyanins: parseFloat(document.getElementById('proanthocyanins').value),
        color_intensity: parseFloat(document.getElementById('color').value),
        hue: parseFloat(document.getElementById('hue').value),
        ["od280/od315_of_diluted_wines"]: parseFloat(document.getElementById('od').value),
        proline: parseInt(document.getElementById('proline').value)
    };
}

// Função para classificar o vinho via API
async function classifyWine(wineData) {
    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'ANALISANDO...';

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(wineData)
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const result = await response.json();
        displayResult(result.prediction);

    } catch (error) {
        console.error('Erro na classificação:', error);
        alert('Erro ao classificar o vinho. Verifique o console para mais detalhes.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'ANALISAR VINHO';
    }
}

// Função para exibir resultados (agora apenas com texto)
function displayResult(predictedClass) {
    predictionText.textContent = getClassTitle(predictedClass);
    wineDescription.textContent = WINE_DESCRIPTIONS[predictedClass];
    
    wineForm.classList.add('hidden');
    resultContainer.classList.remove('hidden');
}

// Função auxiliar para títulos das classes
function getClassTitle(classId) {
    const titles = {
        0: "🍷 CLASSIFICAÇÃO: BAROLO (Classe 0)",
        1: "🍷 CLASSIFICAÇÃO: GRIGNOLINO (Classe 1)",
        2: "🍷 CLASSIFICAÇÃO: BARBERA (Classe 2)"
    };
    return titles[classId];
}

// Função para resetar o formulário
function resetForm() {
    wineForm.reset();
    wineForm.classList.remove('hidden');
    resultContainer.classList.add('hidden');
}

// Event Listeners
wineForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const wineData = getFormData();
    await classifyWine(wineData);
});

// Função global para fechar o popup
function closePopup() {
    const popup = document.getElementById('documentationPopup');
    popup.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function setupPopup() {
    const popup = document.getElementById('documentationPopup');
    const closeBtn = document.querySelector('.close-btn');
    const readMoreBtn = document.getElementById('readMoreBtn');

    function openPopup(e) {
        if (e) e.preventDefault();
        popup.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    readMoreBtn.addEventListener('click', openPopup);
    closeBtn.addEventListener('click', closePopup);

    popup.addEventListener('click', function(e) {
        if (e.target === this) closePopup();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !popup.classList.contains('hidden')) {
            closePopup();
        }
    });
}

// Configuração do Popup
document.addEventListener('DOMContentLoaded', function() {
    closePopup();
    setupPopup();
});
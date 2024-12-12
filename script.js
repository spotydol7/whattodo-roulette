const foods = [
    '한식', '일식', '중식', '양식', '분식', 
    '치킨', '피자', '햄버거', '파스타', '초밥',
    '삼겹살', '찌개', '샐러드', '브런치'
];

const activities = [
    '영화 관람', '카페', '산책', '전시회 관람',
    '보드게임', '방탈출', '노래방', '서점',
    '피크닉', '쇼핑', '동물원', '수족관', '볼링',
    '오락실'
];

let customRoulettes = []; // 커스텀 룰렛 데이터 저장
let rouletteCounter = 0;

function addNewRoulette() {
    const container = document.getElementById('customRoulettes');
    const rouletteId = `custom${rouletteCounter}`;
    
    const section = document.createElement('div');
    section.className = 'roulette-section';
    section.innerHTML = `
        <h2>나만의 룰렛 ${rouletteCounter + 1}</h2>
        <div id="${rouletteId}Roulette" class="roulette">???</div>
        <input type="text" id="${rouletteId}Input" class="custom-input" placeholder="항목 추가 (쉼표로 구분)">
        <button onclick="updateCustomRoulette('${rouletteId}')" class="custom-button">적용하기</button>
    `;
    
    container.appendChild(section);
    
    // 새 룰렛 데이터 초기화
    customRoulettes[rouletteId] = ['커스텀1', '커스텀2', '커스텀3'];
    rouletteCounter++;
}

function updateCustomRoulette(id) {
    const input = document.getElementById(`${id}Input`);
    const newItems = input.value.split(',').map(item => item.trim()).filter(item => item);
    
    if (newItems.length > 0) {
        customRoulettes[id] = newItems;
        input.value = '';
        const element = document.getElementById(`${id}Roulette`);
        element.innerHTML = '???';
    }
}

function spinAllRoulettes() {
    spinRoulette('food');
    spinRoulette('activity');
    // 모든 커스텀 룰렛 돌리기
    for (let i = 0; i < rouletteCounter; i++) {
        spinRoulette(`custom${i}`);
    }
}

function spinRoulette(type) {
    const element = document.getElementById(`${type}Roulette`);
    const items = type === 'food' ? foods : 
                 type === 'activity' ? activities : 
                 customRoulettes[type];
    
    let duration = 3000;
    let startTime = null;
    let currentIndex = 0;
    
    // 초기 상태 설정
    element.innerHTML = '';
    const itemHeight = 48; // 3rem
    
    function createItem(text, offset, isFinal = false) {
        const div = document.createElement('div');
        div.className = 'roulette-item';
        if (isFinal) {
            div.classList.add('final');
        }
        div.textContent = text;
        div.style.transform = `translateY(${offset}px)`;
        return div;
    }
    
    // 초기 아이템 3개 생성
    for (let i = -1; i <= 1; i++) {
        const index = (currentIndex + i + items.length) % items.length;
        element.appendChild(createItem(items[index], i * itemHeight));
    }
    
    // 미리 최종 전 수 결정
    const totalRotations = 20 + Math.random(); // 20~21 회전
    
    function animate(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // easeOut 효과 적용
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        // 회전 속도 계산
        const currentRotation = totalRotations * easeOut;
        const currentPosition = Math.floor(currentRotation * items.length);
        
        if (progress < 1) {
            // 아이템 업데이트
            element.innerHTML = '';
            for (let i = -1; i <= 1; i++) {
                const offset = (i * itemHeight) - ((currentRotation * itemHeight * items.length) % itemHeight);
                const index = (currentPosition + i + items.length) % items.length;
                element.appendChild(createItem(items[index], offset));
            }
            requestAnimationFrame(animate);
        } else {
            // 마지막 위치의 아이템 선택
            const finalIndex = currentPosition % items.length;
            element.innerHTML = '';
            element.appendChild(createItem(items[finalIndex], 0, true));
        }
    }
    
    requestAnimationFrame(animate);
} 
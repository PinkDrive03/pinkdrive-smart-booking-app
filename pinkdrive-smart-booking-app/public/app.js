const state = {
  user: null,
  pickup: null, drop: null,
  pickupName: '', dropName: '',
  vehicle: null, payMethod: 'cash',
  fare: 0, distance: 0,
  weather: 'normal',
  traffic: 'normal',
  demand: 'normal',
  timeType: 'normal',
  serviceType: 'ride',
  restaurantName: '',
  foodSelections: {},
  foodNote: '',
  foodRestaurantMarkers: [],
  routeCoords: [],
  animationFrame: null,
  driverCandidates: [],
  selectedDriver: null,
  driverCandidateMarkers: [],
  radarCircle: null,
  radarMarker: null,
  radarTimer: null,
  searchTimeout: null,
  cancelSearchInterval: null,
  driverPickupMin: 0,
  totalTripMin: 0,
  map: null, pickupMarker: null, dropMarker: null, routeLine: null, driverMarker: null,
  trackInterval: null, rideStep: 0
};

const VEHICLES = [
  { id:'bike', emoji:'🛵', name:'Xe Máy', sub:'Nhanh chóng, tiết kiệm', base:10000, perKm:5000 },
  { id:'car4', emoji:'🚗', name:'Ô Tô 4 Chỗ', sub:'Tiện nghi, rộng rãi', base:25000, perKm:12000 },
  { id:'car7', emoji:'🚙', name:'Ô Tô 7 Chỗ', sub:'Dành cho nhóm bạn', base:30000, perKm:15000 },
  { id:'premium', emoji:'🚘', name:'Xe Sang', sub:'Trải nghiệm đẳng cấp', base:50000, perKm:20000 },
];
const FOOD_RESTAURANTS = [
  { name: 'Cơm Tấm Ba Ghiền', lat: 10.7902, lng: 106.6722 },
  { name: 'Bánh Mì Huỳnh Hoa', lat: 10.7725, lng: 106.6931 },
  { name: 'Phở Hòa Pasteur', lat: 10.7881, lng: 106.6875 },
  { name: 'Bún Bò Gánh', lat: 10.7769, lng: 106.7009 },
  { name: 'Gogi House Nguyễn Gia Trí', lat: 10.8021, lng: 106.7142 },
  { name: 'KFC Điện Biên Phủ', lat: 10.8015, lng: 106.7148 },
  { name: 'Highlands Coffee Landmark 81', lat: 10.7949, lng: 106.7218 },
  { name: 'The Coffee House Nguyễn Thị Minh Khai', lat: 10.7824, lng: 106.6927 }
];

const FOOD_MENU_BY_RESTAURANT = {
  'Cơm Tấm Ba Ghiền': [
    { category: 'Món Chính', name: 'Cơm sườn trứng', price: 55000 },
    { category: 'Món Chính', name: 'Cơm sườn bì chả', price: 62000 },
    { category: 'Món Chính', name: 'Cơm gà sườn cay', price: 68000 },
    { category: 'Món Chính', name: 'Cơm sườn non nướng mật ong', price: 72000 },
    { category: 'Món Chính', name: 'Cơm đùi gà chiên nước mắm', price: 70000 },
    { category: 'Ăn Kèm', name: 'Canh khổ qua nhồi thịt', price: 30000 },
    { category: 'Ăn Kèm', name: 'Dưa chua nhà làm', price: 12000 },
    { category: 'Đồ Uống', name: 'Trà đá', price: 5000 }
  ],
  'Bánh Mì Huỳnh Hoa': [
    { category: 'Bánh Mì', name: 'Bánh mì thập cẩm', price: 68000 },
    { category: 'Bánh Mì', name: 'Bánh mì xá xíu', price: 52000 },
    { category: 'Bánh Mì', name: 'Bánh mì chả lụa', price: 45000 },
    { category: 'Bánh Mì', name: 'Bánh mì gà quay', price: 58000 },
    { category: 'Bánh Mì', name: 'Bánh mì pate trứng', price: 42000 },
    { category: 'Ăn Kèm', name: 'Xúc xích phô mai', price: 28000 },
    { category: 'Đồ Uống', name: 'Nước suối', price: 10000 },
    { category: 'Đồ Uống', name: 'Sữa đậu nành', price: 18000 }
  ],
  'Phở Hòa Pasteur': [
    { category: 'Phở Bò', name: 'Phở tái', price: 75000 },
    { category: 'Phở Bò', name: 'Phở nạm', price: 78000 },
    { category: 'Phở Bò', name: 'Phở tái nạm', price: 82000 },
    { category: 'Phở Gà', name: 'Phở gà', price: 70000 },
    { category: 'Phở Gà', name: 'Phở gà đùi', price: 76000 },
    { category: 'Ăn Kèm', name: 'Quẩy', price: 12000 },
    { category: 'Ăn Kèm', name: 'Trứng trần', price: 10000 },
    { category: 'Đồ Uống', name: 'Trà đá', price: 5000 }
  ],
  'Bún Bò Gánh': [
    { category: 'Bún Bò', name: 'Bún bò tái', price: 65000 },
    { category: 'Bún Bò', name: 'Bún bò giò', price: 70000 },
    { category: 'Bún Bò', name: 'Bún bò đặc biệt', price: 79000 },
    { category: 'Bún Bò', name: 'Bún bò nạm chả', price: 76000 },
    { category: 'Món Phụ', name: 'Chả cua', price: 18000 },
    { category: 'Món Phụ', name: 'Giò heo thêm', price: 25000 },
    { category: 'Đồ Uống', name: 'Trà tắc', price: 15000 },
    { category: 'Đồ Uống', name: 'Sâm mía lau', price: 18000 }
  ],
  'Gogi House Nguyễn Gia Trí': [
    { category: 'Combo', name: 'Combo bò nướng 1 người', price: 189000 },
    { category: 'Combo', name: 'Combo heo nướng 1 người', price: 169000 },
    { category: 'Món Lẻ', name: 'Cơm trộn Hàn Quốc', price: 89000 },
    { category: 'Món Lẻ', name: 'Canh kim chi', price: 69000 },
    { category: 'Món Lẻ', name: 'Tokbokki', price: 79000 },
    { category: 'Ăn Kèm', name: 'Kimchi thêm', price: 25000 },
    { category: 'Đồ Uống', name: 'Trà đào', price: 29000 },
    { category: 'Đồ Uống', name: 'Nước ngọt lon', price: 20000 }
  ],
  'KFC Điện Biên Phủ': [
    { category: 'Combo', name: 'Combo Gà 2 miếng', price: 69000 },
    { category: 'Combo', name: 'Combo Gà 3 miếng', price: 89000 },
    { category: 'Combo', name: 'Combo Burger Zinger', price: 99000 },
    { category: 'Món Lẻ', name: 'Burger Zinger', price: 55000 },
    { category: 'Món Lẻ', name: 'Gà rán 1 miếng', price: 36000 },
    { category: 'Ăn Kèm', name: 'Khoai tây chiên', price: 32000 },
    { category: 'Đồ Uống', name: 'Pepsi lon', price: 18000 },
    { category: 'Đồ Uống', name: '7Up lon', price: 18000 }
  ],
  'Highlands Coffee Landmark 81': [
    { category: 'Cà Phê', name: 'Phin sữa đá', price: 39000 },
    { category: 'Cà Phê', name: 'Freeze Trà Xanh', price: 55000 },
    { category: 'Trà', name: 'Trà sen vàng', price: 45000 },
    { category: 'Trà', name: 'Trà thạch đào', price: 49000 },
    { category: 'Bánh', name: 'Bánh mì chà bông', price: 32000 },
    { category: 'Bánh', name: 'Bánh mousse', price: 42000 },
    { category: 'Bánh', name: 'Tiramisu mini', price: 45000 },
    { category: 'Khác', name: 'Nước suối', price: 12000 }
  ],
  'The Coffee House Nguyễn Thị Minh Khai': [
    { category: 'Cà Phê', name: 'Cà phê sữa đá', price: 42000 },
    { category: 'Cà Phê', name: 'Cold Brew truyền thống', price: 49000 },
    { category: 'Trà', name: 'Trà Oolong hạt sen', price: 49000 },
    { category: 'Trà', name: 'Hi-Tea Vải', price: 55000 },
    { category: 'Bánh', name: 'Bánh mì gà xé', price: 39000 },
    { category: 'Bánh', name: 'Croissant bơ', price: 32000 },
    { category: 'Bánh', name: 'Mousse chanh dây', price: 45000 },
    { category: 'Khác', name: 'Nước ép cam', price: 39000 }
  ]
};

function getMenuByRestaurant(restaurantName){
  return FOOD_MENU_BY_RESTAURANT[restaurantName] || [];
}
function getSelectedFoodTotal(){
  const menuMap = Object.fromEntries(getMenuByRestaurant(state.restaurantName).map(item => [item.name, item.price]));
  return Object.entries(state.foodSelections || {}).reduce((sum, [name, qty]) => {
    if(!qty || qty < 1) return sum;
    return sum + (menuMap[name] || 0) * qty;
  }, 0);
}
function getSelectedFoodQuantity(){
  return Object.values(state.foodSelections || {}).reduce((sum, qty) => sum + (Number(qty) || 0), 0);
}
function getSelectedFoodItemCount(){
  return Object.entries(state.foodSelections || {}).filter(([, qty]) => (Number(qty) || 0) > 0).length;
}
function syncFoodSelectionsByRestaurant(){
  const menuNames = new Set(getMenuByRestaurant(state.restaurantName).map(item => item.name));
  const next = {};

  Object.entries(state.foodSelections || {}).forEach(([name, qty]) => {
    if(menuNames.has(name) && qty > 0){
      next[name] = Math.max(1, Number(qty) || 1);
    }
  });

  state.foodSelections = next;
}
const $ = id => document.getElementById(id);
const fmt = n => new Intl.NumberFormat('vi-VN').format(Math.round(n)) + 'đ';
function fmtDuration(minutes){
  const min = Math.round(minutes || 0);

  if(min < 60){
    return `${min} phút`;
  }

  const h = Math.floor(min / 60);
  const m = min % 60;

  if(m === 0){
    return `${h} giờ`;
  }

  return `${h} giờ ${m} phút`;
}

function fmtArrivalTime(minutes){
  const arrival = new Date(Date.now() + Math.round(minutes || 0) * 60000);

  return arrival.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function randInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min, max){
  return Math.random() * (max - min) + min;
}

function getTrafficMultiplier(){
  const table = {
    light: 1,
    normal: 1.1,
    medium: 1.25,
    heavy: 1.5,
    jam: 1.8
  };

  return table[state.traffic] || 1;
}

function generateDriverCandidates(count = 6){
  if(!state.pickup) return [];

  const names = [
    'Lê Minh C',
    'Nguyễn Hoàng K',
    'Trần Quốc H',
    'Phạm Anh T',
    'Võ Minh D',
    'Đặng Gia B',
    'Huỳnh Thanh P'
  ];

  const plates = [
    '50K-111.22',
    '59A-283.91',
    '51F-902.18',
    '60B-448.20',
    '68C-771.35',
    '70D-109.82',
    '65E-555.19'
  ];

  const candidates = [];

  for(let i = 0; i < count; i++){
    const angle = Math.random() * Math.PI * 2;
    const isBusyArea = state.demand === 'surge' || state.traffic === 'heavy' || state.traffic === 'jam';
    const difficultSearch = Math.random() < 0.45;

 let radiusKm;

if (difficultSearch || isBusyArea) {
  radiusKm = randFloat(4.5, 9);
} else {
  radiusKm = randFloat(1.2, 4.5);
}
    const lat = state.pickup.lat + (radiusKm / 111) * Math.cos(angle);
    const lng = state.pickup.lng + (radiusKm / (111 * Math.cos(state.pickup.lat * Math.PI / 180))) * Math.sin(angle);

    const distanceToPickup = haversine(
      lat,
      lng,
      state.pickup.lat,
      state.pickup.lng
    );

    const driverSpeedKmh = randInt(18, 32);
    const randomBufferMin = randInt(1, 4);

    const pickupMin = Math.max(
      3,
      Math.round((distanceToPickup / driverSpeedKmh) * 60 * getTrafficMultiplier() + randomBufferMin)
    );

    candidates.push({
      id: i + 1,
      name: names[i % names.length],
      plate: plates[i % plates.length],
      lat,
      lng,
      distanceToPickup,
      pickupMin,
      score: pickupMin
    });
  }

  return candidates.sort((a, b) => a.score - b.score);
}

function clearDriverCandidateMarkers(){
  if(state.driverCandidateMarkers && state.driverCandidateMarkers.length > 0){
    state.driverCandidateMarkers.forEach(marker => marker.remove());
  }

  state.driverCandidateMarkers = [];
}

function showDriverCandidatesOnMap(){
  clearDriverCandidateMarkers();

  if(!state.driverCandidates || state.driverCandidates.length === 0 || !state.map) return;

  const vehicleEmoji = state.vehicle?.emoji || '🏍️';

  state.driverCandidates.forEach(driver => {
    const marker = L.marker([driver.lat, driver.lng], {
      icon: L.divIcon({
    className: '',
    html: `<div style="font-size:24px; filter:drop-shadow(0 3px 5px rgba(0,0,0,0.35));">${vehicleEmoji}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
})
    }).addTo(state.map);

    marker.bindTooltip(`${driver.name} • ${driver.pickupMin} phút`, {
      direction: 'top',
      offset: [0, -12]
    });

    state.driverCandidateMarkers.push(marker);
  });
}

function keepOnlySelectedDriverMarker(){
  clearDriverCandidateMarkers();

  if(!state.selectedDriver || !state.map) return;

  const vehicleEmoji = state.vehicle?.emoji || '🏍️';

  state.driverMarker = L.marker([state.selectedDriver.lat, state.selectedDriver.lng], {
    icon: L.divIcon({
    className: '',
    html: `<div style="font-size:28px; filter:drop-shadow(0 4px 6px rgba(0,0,0,0.4));">${vehicleEmoji}</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17]
})
  }).addTo(state.map);

  state.driverMarker.bindTooltip(
    `${state.selectedDriver.name} • đến sau ${state.selectedDriver.pickupMin} phút`,
    {
      direction: 'top',
      offset: [0, -16]
    }
  );
}

function startRadarSearch(){
  if(!state.pickup || !state.map) return;

  stopRadarSearch();

  let radius = 200;

  state.radarCircle = L.circle([state.pickup.lat, state.pickup.lng], {
    radius,
    color: '#f472b6',
    fillColor: '#f9a8d4',
    fillOpacity: 0.12,
    weight: 2
  }).addTo(state.map);

  state.radarTimer = setInterval(() => {
    radius += 220;

    if(radius > 2800){
      radius = 200;
    }

    const opacity = Math.max(0.12, 0.75 - radius / 3300);

    state.radarCircle.setRadius(radius);
    state.radarCircle.setStyle({
      opacity,
      fillOpacity: opacity * 0.18
    });
  }, 180);
}

function stopRadarSearch(){
  if(state.radarTimer){
    clearInterval(state.radarTimer);
    state.radarTimer = null;
  }

  if(state.radarCircle){
    state.radarCircle.remove();
    state.radarCircle = null;
  }

  if(state.radarMarker){
    state.radarMarker.remove();
    state.radarMarker = null;
  }
}

function showCancelLongWait(show, pickupMin = 0, countdown = 0){
  if(!$('cancel-long-wait-box') && $('tracking-title')){
    $('tracking-title').insertAdjacentHTML('afterend', `
      <div id="cancel-long-wait-box" style="display:none; margin-top:12px; padding:12px; border-radius:14px; background:#fff1f2; border:1px solid #fb7185;">
        <div style="font-weight:700; color:#be123c; margin-bottom:8px;" id="cancel-long-wait-text"></div>
        <button onclick="cancelCurrentRide()" style="border:none; background:#e11d48; color:white; padding:10px 14px; border-radius:999px; font-weight:700; cursor:pointer;">
          Hủy chuyến
        </button>
      </div>
    `);
  }

  const box = $('cancel-long-wait-box');
  const text = $('cancel-long-wait-text');

  if(!box || !text) return;

  if(state.cancelSearchInterval){
    clearInterval(state.cancelSearchInterval);
    state.cancelSearchInterval = null;
  }

  if(show){
    box.style.display = 'block';

    let remain = countdown;

    if(remain > 0){
      text.textContent = `Tài xế gần nhất dự kiến đến sau ${pickupMin} phút. Bạn có ${remain} giây để hủy chuyến.`;

      state.cancelSearchInterval = setInterval(() => {
        remain--;

        if(remain <= 0){
          clearInterval(state.cancelSearchInterval);
          state.cancelSearchInterval = null;
          box.style.display = 'none';
          return;
        }

        text.textContent = `Tài xế gần nhất dự kiến đến sau ${pickupMin} phút. Bạn có ${remain} giây để hủy chuyến.`;
      }, 1000);
    } else {
      text.textContent = `Tài xế gần nhất dự kiến đến sau ${pickupMin} phút. Bạn có thể hủy chuyến nếu không muốn chờ lâu.`;
    }
  } else {
    box.style.display = 'none';
  }
}

window.cancelCurrentRide = function(){
  if(state.cancelSearchInterval){
  clearInterval(state.cancelSearchInterval);
  state.cancelSearchInterval = null;
}
  if(state.searchTimeout){
    clearTimeout(state.searchTimeout);
    state.searchTimeout = null;
  }

  if(state.animationFrame){
    cancelAnimationFrame(state.animationFrame);
    state.animationFrame = null;
  }

  clearInterval(state.trackInterval);
  stopRadarSearch();

  if(state.driverMarker){
    state.driverMarker.remove();
    state.driverMarker = null;
  }

  showCancelLongWait(false);
  toast('Đã hủy chuyến');

  showStep('step-vehicle');
  renderVehicles();
};

function haversine(lat1,lon1,lat2,lon2){
  const R=6371, dLat=(lat2-lat1)*Math.PI/180, dLon=(lon2-lon1)*Math.PI/180;
  const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

function updateTrackingStep(stage){
  const normal = '#6b7280';
  const active = '#ec4899';

  if($('step-find')) $('step-find').style.color = normal;
  if($('step-coming')) $('step-coming').style.color = normal;
  if($('step-pickup')) $('step-pickup').style.color = normal;
  if($('step-dropoff')) $('step-dropoff').style.color = normal;

  if(stage === 'find' && $('step-find')) $('step-find').style.color = active;
  if(stage === 'coming' && $('step-coming')) $('step-coming').style.color = active;
  if(stage === 'pickup' && $('step-pickup')) $('step-pickup').style.color = active;
  if(stage === 'dropoff' && $('step-dropoff')) $('step-dropoff').style.color = active;
}
function updateTrackingLabels(){
  const isFood = state.serviceType === 'food';

  if($('step-find')) $('step-find').textContent = 'Tìm xe';
  if($('step-coming')) $('step-coming').textContent = isFood ? 'Đến quán' : 'Đang đến';
  if($('step-pickup')) $('step-pickup').textContent = isFood ? 'Lấy món' : 'Đón khách';
  if($('step-dropoff')) $('step-dropoff').textContent = isFood ? 'Giao món' : 'Trả khách';
}

function toast(msg){
  const t=$('toast'); t.textContent=msg; t.classList.add('show');
  setTimeout(async () => {
    t.classList.remove('show');
  }, 3000);
}
function initServiceChoice(){
  const rideBtn = $('loc-service-ride');
  const foodBtn = $('loc-service-food');

  if(!rideBtn || !foodBtn) return;

  const setService = type => {
    state.serviceType = type;

    const isFood = type === 'food';

    rideBtn.style.background = isFood ? 'white' : '#ec4899';
    rideBtn.style.color = isFood ? '#ec4899' : 'white';

    foodBtn.style.background = isFood ? '#ec4899' : 'white';
    foodBtn.style.color = isFood ? 'white' : '#ec4899';

    $('input-pickup').placeholder = isFood
      ? 'Chọn quán ăn hoặc điểm lấy món...'
      : 'Điểm đón của bạn...';

    $('input-drop').placeholder = isFood
      ? 'Địa chỉ giao món...'
      : 'Nhập điểm đến...';
      if($('food-info-box')){
  $('food-info-box').style.display = isFood ? 'block' : 'none';
}

    if(isFood){
      renderFoodRestaurants();
      toast('Chọn quán ăn trên bản đồ hoặc nhập tên quán');
    } else {
      clearFoodRestaurantMarkers();
    }
  };

  rideBtn.onclick = () => setService('ride');
  foodBtn.onclick = () => setService('food');

  if($('restaurant-name')) $('restaurant-name').oninput = e => state.restaurantName = e.target.value.trim();

if($('food-note')) $('food-note').oninput = e => state.foodNote = e.target.value.trim();
  setService(state.serviceType || 'ride');
}
// Init map once
function initMap(){
  if(state.map) return;
  state.map = L.map('main-map',{zoomControl:true, attributionControl:false}).setView([10.7769, 106.7009], 14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(state.map);
  addVietnamSeaLabels();
  
  state.map.on('click', async e => {
    if($('step-location').style.display==='none') return; // only allow click in location step
    const address = await reverseGeocode(e.latlng.lat, e.latlng.lng);

    if(!state.pickup){
    setPickup(e.latlng.lat, e.latlng.lng, address);
    } else if(!state.drop){
    setDrop(e.latlng.lat, e.latlng.lng, address);
    }
  });
}

function addVietnamSeaLabels(){
  if(!state.map) return;

  const labels = [
    { name: 'Quần đảo Hoàng Sa', lat: 16.5, lng: 112.0 },
    { name: 'Quần đảo Trường Sa', lat: 10.2, lng: 114.3 }
  ];

  labels.forEach(item => {
    L.marker([item.lat, item.lng], {
      interactive: false,
      keyboard: false,
      icon: L.divIcon({
        className: '',
        html: `<div style="background:rgba(255,255,255,0.92); color:#be185d; font-weight:800; font-size:12px; padding:4px 8px; border-radius:999px; border:1px solid #f9a8d4; box-shadow:0 2px 8px rgba(0,0,0,0.15); white-space:nowrap;">${item.name}</div>`,
        iconSize: [140, 26],
        iconAnchor: [70, 13]
      })
    }).addTo(state.map);
  });
}

const pinkIcon = L.divIcon({ html:`<div style="width:16px;height:16px;border-radius:50%;background:var(--pink);border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`, iconSize:[16,16], iconAnchor:[8,8], className:'' });
const darkIcon = L.divIcon({ html:`<div style="width:16px;height:16px;border-radius:50%;background:var(--pink-dark);border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`, iconSize:[16,16], iconAnchor:[8,8], className:'' });

function setPickup(lat, lng, name){
  state.pickup = {lat, lng}; state.pickupName = name;
  $('input-pickup').value = name;
  if(state.pickupMarker) state.pickupMarker.remove();
  state.pickupMarker = L.marker([lat, lng], {icon: pinkIcon}).addTo(state.map);
  checkLocations();
}
function setDrop(lat, lng, name){
  state.drop = {lat, lng}; state.dropName = name;
  $('input-drop').value = name;
  if(state.dropMarker) state.dropMarker.remove();
  state.dropMarker = L.marker([lat, lng], {icon: darkIcon}).addTo(state.map);
  checkLocations();
}
function clearFoodRestaurantMarkers(){
  if(state.foodRestaurantMarkers && state.foodRestaurantMarkers.length > 0){
    state.foodRestaurantMarkers.forEach(marker => marker.remove());
  }

  state.foodRestaurantMarkers = [];
}

function renderFoodRestaurants(){
  clearFoodRestaurantMarkers();

  if(state.serviceType !== 'food' || !state.map) return;

  FOOD_RESTAURANTS.forEach(restaurant => {
    const marker = L.marker([restaurant.lat, restaurant.lng], {
      icon: L.divIcon({
        className: '',
        html: `<div style="font-size:26px; filter:drop-shadow(0 3px 5px rgba(0,0,0,0.35));">&#127828;</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      })
    }).addTo(state.map);

    marker.bindTooltip(restaurant.name, {
      direction: 'top',
      offset: [0, -12]
    });

    marker.on('click', () => {
      state.restaurantName = restaurant.name;
      setPickup(restaurant.lat, restaurant.lng, restaurant.name);

      if($('vehicle-restaurant-name')){
        $('vehicle-restaurant-name').value = restaurant.name;
        state.foodSelections = {};
        if(state.vehicle) selectVehicle(state.vehicle.id);
      }

      toast(`Đã chọn quán: ${restaurant.name}`);
    });

    state.foodRestaurantMarkers.push(marker);
  });
}

async function checkLocations(){
  if(state.pickup && state.drop){
   if(state.routeLine) state.routeLine.remove();

const url = `https://router.project-osrm.org/route/v1/driving/${state.pickup.lng},${state.pickup.lat};${state.drop.lng},${state.drop.lat}?overview=full&geometries=geojson&steps=true`;
const res = await fetch(url);
const data = await res.json();

if(!data.routes || data.routes.length === 0){
    alert("Không tìm được tuyến đường thật");
    return;
}

const bestRoute = data.routes[0];

const routeCoords = bestRoute.geometry.coordinates.map(coord => {
    return [coord[1], coord[0]];
});
state.routeCoords = routeCoords;

state.routeLine = L.polyline(routeCoords, {
    color: '#f472b6',
    weight: 5
}).addTo(state.map);

state.map.fitBounds(state.routeLine.getBounds(), {padding: [50,50]});

const distanceKm = bestRoute.distance / 1000;
const durationMin = bestRoute.duration / 60;
if (distanceKm > 200) {
  toast('Quãng đường quá xa. Ứng dụng chỉ hỗ trợ chuyến nội đô hoặc dưới 200km.');
  if(state.routeLine) state.routeLine.remove();
  return;
}

state.realDistanceKm = distanceKm;
state.distanceKm = distanceKm;
state.realDurationMin = durationMin;
state.durationMin = durationMin;

    
    // Auto transition to vehicle step
    showStep('step-vehicle');
    renderVehicles();
    await autoFetchWeather();
    autoPredictRideConditions();
  } else if(state.pickup || state.drop) {
    const p = state.pickup || state.drop;
    state.map.setView([p.lat, p.lng], 15);
  }
}

function showStep(id){
  document.querySelectorAll('.panel-step').forEach(el=>el.style.display='none');
  $(id).style.display='flex';
}

function resetBooking(){
  state.vehicle = null;
  state.routeLine?.remove(); state.routeLine = null;
  state.dropMarker?.remove(); state.dropMarker = null;
  state.drop = null; state.dropName = ''; $('input-drop').value = '';
  $('fare-summary').style.display = 'none';
  showStep('step-location');
}
function renderServiceOptions(){
  if($('service-options')) return;

  $('vehicle-list').insertAdjacentHTML('beforebegin', `
    <div id="service-options" style="margin-bottom:16px; padding:16px; border-radius:18px; background:#fff; border:1px solid #fbcfe8; box-shadow:0 4px 14px rgba(0,0,0,0.06);">
      <div style="font-weight:900; margin-bottom:12px;">Chọn dịch vụ</div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <button id="btn-service-ride" style="padding:12px; border-radius:14px; border:1px solid #f472b6; background:#ec4899; color:white; font-weight:900; cursor:pointer;">
          🛵 Đặt xe
        </button>

        <button id="btn-service-food" style="padding:12px; border-radius:14px; border:1px solid #f472b6; background:white; color:#ec4899; font-weight:900; cursor:pointer;">
          🍔 Giao đồ ăn
        </button>
      </div>

      <div id="food-options" style="display:none; margin-top:14px;">
        <div style="display:grid; gap:10px;">
          <input id="restaurant-name" placeholder="Tên quán ăn" style="padding:12px; border-radius:12px; border:1px solid #e5e7eb;">
          <input id="food-name" placeholder="Tên món ăn" style="padding:12px; border-radius:12px; border:1px solid #e5e7eb;">
          <input id="food-price" type="number" placeholder="Giá món ăn (VD: 45000)" style="padding:12px; border-radius:12px; border:1px solid #e5e7eb;">
          <textarea id="food-note" placeholder="Ghi chú cho shipper (không bắt buộc)" style="padding:12px; border-radius:12px; border:1px solid #e5e7eb; resize:none; min-height:70px;"></textarea>
        </div>
      </div>
    </div>
  `);

  const setService = type => {
    state.serviceType = type;

    const isFood = type === 'food';

    $('btn-service-ride').style.background = isFood ? 'white' : '#ec4899';
    $('btn-service-ride').style.color = isFood ? '#ec4899' : 'white';

    $('btn-service-food').style.background = isFood ? '#ec4899' : 'white';
    $('btn-service-food').style.color = isFood ? 'white' : '#ec4899';

    $('food-options').style.display = isFood ? 'block' : 'none';
    if(isFood){
    renderFoodRestaurants();
    toast('Chọn quán ăn trên bản đồ làm điểm lấy món');
  } else {
    clearFoodRestaurantMarkers();
}

    if(state.vehicle){
      selectVehicle(state.vehicle.id);
    }
  };

  $('btn-service-ride').onclick = () => setService('ride');
  $('btn-service-food').onclick = () => setService('food');

  $('restaurant-name').oninput = e => state.restaurantName = e.target.value.trim();
  $('food-note').oninput = e => state.foodNote = e.target.value.trim();
}
function renderFoodOrderBox(){
  if($('food-order-box')){
    $('food-order-box').style.display = state.serviceType === 'food' ? 'block' : 'none';
  } else {
    $('vehicle-list').insertAdjacentHTML('beforebegin', `
      <div id="food-order-box" style="display:none; margin-bottom:16px; padding:16px; border-radius:18px; background:#fff7fb; border:1px solid #fbcfe8;">
        <div style="font-weight:900; margin-bottom:12px;">Thông tin đơn đồ ăn</div>

        <div style="display:grid; gap:10px;">
          <select id="vehicle-restaurant-name" style="padding:12px; border-radius:12px; border:1px solid #e5e7eb;"></select>
          <div id="vehicle-food-menu" style="display:grid; gap:10px; max-height:340px; overflow-y:auto; border:1px solid #fbcfe8; border-radius:12px; padding:10px; background:#fff;"></div>
          <textarea id="vehicle-food-note" placeholder="Ghi chú cho shipper" style="padding:12px; border-radius:12px; border:1px solid #e5e7eb; resize:none; min-height:70px;"></textarea>
        </div>
      </div>
    `);

    $('vehicle-food-note').oninput = e => state.foodNote = e.target.value.trim();
  }

  $('food-order-box').style.display = state.serviceType === 'food' ? 'block' : 'none';

  const restaurantSelect = $('vehicle-restaurant-name');
  const foodMenuBox = $('vehicle-food-menu');
  const foodNoteInput = $('vehicle-food-note');

  restaurantSelect.innerHTML = FOOD_RESTAURANTS
    .map(r => `<option value="${r.name}">${r.name}</option>`)
    .join('');

  if(!state.restaurantName || !FOOD_RESTAURANTS.some(r => r.name === state.restaurantName)){
    state.restaurantName = FOOD_RESTAURANTS[0].name;
  }

  restaurantSelect.value = state.restaurantName;
  syncFoodSelectionsByRestaurant();
  foodNoteInput.value = state.foodNote || '';

  const renderMenuWithCheckboxes = () => {
    const menuItems = getMenuByRestaurant(state.restaurantName);
    const groupedMenu = menuItems.reduce((acc, item) => {
      if(!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});

    foodMenuBox.innerHTML = Object.entries(groupedMenu).map(([category, items]) => `
      <div>
        <div style="font-weight:800; margin:6px 0 8px;">${category}</div>
        ${items.map(item => {
          const qty = state.foodSelections[item.name] || 0;
          return `
            <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; padding:6px 0; border-bottom:1px dashed #f3d4e6;">
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer; flex:1;">
                <input type="checkbox" class="food-item-check" data-name="${item.name}" ${qty > 0 ? 'checked' : ''}>
                <span style="font-weight:600;">${item.name} - ${fmt(item.price)}</span>
              </label>
              <div style="display:flex; align-items:center; gap:6px; ${qty > 0 ? '' : 'opacity:.45; pointer-events:none;'}" data-qty-wrap="${item.name}">
                <button type="button" class="food-qty-btn" data-action="minus" data-name="${item.name}" style="width:28px; height:28px; border-radius:8px; border:1px solid #f9a8d4; background:#fff;">-</button>
                <input class="food-item-qty" data-name="${item.name}" type="number" min="1" value="${qty > 0 ? qty : 1}" style="width:52px; text-align:center; padding:4px; border-radius:8px; border:1px solid #e5e7eb;">
                <button type="button" class="food-qty-btn" data-action="plus" data-name="${item.name}" style="width:28px; height:28px; border-radius:8px; border:1px solid #f9a8d4; background:#fff;">+</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `).join('');

    foodMenuBox.querySelectorAll('.food-item-check').forEach(checkEl => {
      const name = checkEl.dataset.name;
      checkEl.onchange = e => {
        if(e.target.checked){
          state.foodSelections[name] = Math.max(1, state.foodSelections[name] || 1);
        } else {
          delete state.foodSelections[name];
        }
        renderMenuWithCheckboxes();
        if(state.vehicle) selectVehicle(state.vehicle.id);
      };
    });

    foodMenuBox.querySelectorAll('.food-qty-btn').forEach(btn => {
      btn.onclick = () => {
        const name = btn.dataset.name;
        if(!(name in state.foodSelections)) return;
        const current = Math.max(1, Number(state.foodSelections[name]) || 1);
        const next = btn.dataset.action === 'minus' ? Math.max(1, current - 1) : current + 1;
        state.foodSelections[name] = next;
        renderMenuWithCheckboxes();
        if(state.vehicle) selectVehicle(state.vehicle.id);
      };
    });

    foodMenuBox.querySelectorAll('.food-item-qty').forEach(input => {
      input.oninput = e => {
        const name = input.dataset.name;
        if(!(name in state.foodSelections)) return;
        state.foodSelections[name] = Math.max(1, Number(e.target.value) || 1);
        if(state.vehicle) selectVehicle(state.vehicle.id);
      };
    });
  };

  renderMenuWithCheckboxes();

  restaurantSelect.onchange = e => {
    const selectedName = e.target.value;
    state.restaurantName = selectedName;
    state.foodSelections = {};

    const selectedRestaurant = FOOD_RESTAURANTS.find(r => r.name === selectedName);
    if(selectedRestaurant){
      setPickup(selectedRestaurant.lat, selectedRestaurant.lng, selectedRestaurant.name);
    }

    renderMenuWithCheckboxes();
    if(state.vehicle) selectVehicle(state.vehicle.id);
    toast(`Đã chọn quán: ${selectedName}`);
  };
}
function renderVehicles(){
  if($('vehicle-step-title')){
  $('vehicle-step-title').textContent = state.serviceType === 'food'
    ? 'Chọn phương tiện giao hàng'
    : 'Chọn loại xe';
}
  renderFoodOrderBox();
  $('vehicle-list').innerHTML = VEHICLES.map(v=>`
    <div class="vehicle-card ${state.vehicle?.id===v.id?'selected':''}" onclick="selectVehicle('${v.id}')">
      <div class="v-emoji">${v.emoji}</div>
      <div class="v-info">
        <div class="v-name">${v.name}</div>
        <div class="v-sub">${v.sub}</div>
      </div>
      <div class="v-price">
        <div class="v-base">${fmt(v.base)}</div>
        <div class="v-perkm">+${fmt(v.perKm)}/km</div>
      </div>
    </div>
  `).join('');
  renderPricingOptions();
}

window.selectVehicle = function(id){
  state.vehicle = VEHICLES.find(v=>v.id===id);
  renderVehicles();
  state.distance = state.realDistanceKm || haversine(state.pickup.lat, state.pickup.lng, state.drop.lat, state.drop.lng);

const weatherFactor = {
  normal: 1,
  hot: 1.05,
  rain: 1.15,
  storm: 1.3
};

const trafficFactor = {
  normal: 1,
  light: 1,
  medium: 1.1,
  heavy: 1.25,
  jam: 1.4
};

const demandFactor = {
  normal: 1,
  low: 0.95,
  high: 1.2,
  surge: 1.45
};

const timeFactor = {
  normal: 1,
  peak: 1.2,
  night: 1.15
};

let extraFee = 0;

if (state.weather === 'rain' && (state.traffic === 'heavy' || state.traffic === 'jam')) {
  extraFee += 8000;
}

if (state.weather === 'storm') {
  extraFee += 12000;
}

if (state.demand === 'surge' && state.timeType === 'peak') {
  extraFee += 15000;
}

if (state.timeType === 'night') {
  extraFee += 7000;
}

if (state.distance > 10) {
  extraFee += 10000;
}

const factor =
  (weatherFactor[state.weather] || 1) *
  (trafficFactor[state.traffic] || 1) *
  (demandFactor[state.demand] || 1) *
  (timeFactor[state.timeType] || 1);

const deliveryBase = state.serviceType === 'food' ? 15000 : state.vehicle.base;
const deliveryPerKm = state.serviceType === 'food' ? 4000 : state.vehicle.perKm;

let serviceFare = deliveryBase + state.distance * deliveryPerKm;

serviceFare = serviceFare * factor + extraFee;
serviceFare = Math.round(serviceFare / 1000) * 1000;

state.deliveryFee = serviceFare;

if(state.serviceType === 'food'){
  state.fare = serviceFare + getSelectedFoodTotal();
} else {
  state.fare = serviceFare;
}

state.fare = Math.round(state.fare / 1000) * 1000;

const estimatedDuration = state.realDurationMin || state.durationMin || Math.max(5, state.distance / 30 * 60);
const arrivalTime = fmtArrivalTime(estimatedDuration);

if(!$('summary-duration') && $('fare-summary')){
  $('fare-summary').insertAdjacentHTML('afterbegin', `
    <div class="summary-row">
      <span>Thời gian di chuyển</span>
      <strong id="summary-duration"></strong>
    </div>
    <div class="summary-row">
      <span>Dự kiến tới nơi</span>
      <strong id="summary-arrival"></strong>
    </div>
  `);
}

$('summary-dist').textContent = state.distance.toFixed(1) + ' km';
$('summary-duration').textContent = fmtDuration(estimatedDuration);
$('summary-arrival').textContent = arrivalTime;
if(state.serviceType === 'food'){
  if(!$('summary-food-block') && $('summary-total')){
    $('summary-total').parentElement.insertAdjacentHTML('beforebegin', `
      <div id="summary-food-block">
        <div class="summary-row">
          <span>Giá món ăn</span>
          <strong id="summary-food-price"></strong>
        </div>
        <div class="summary-row">
          <span>Số lượng món</span>
          <strong id="summary-food-qty"></strong>
        </div>
        <div class="summary-row">
          <span>Số loại đã chọn</span>
          <strong id="summary-food-count"></strong>
        </div>
        <div class="summary-row">
          <span>Phí giao hàng</span>
          <strong id="summary-delivery-fee"></strong>
        </div>
      </div>
    `);
  }

  $('summary-food-price').textContent = fmt(getSelectedFoodTotal());
  $('summary-food-qty').textContent = `x${getSelectedFoodQuantity()}`;
  $('summary-food-count').textContent = `${getSelectedFoodItemCount()} món`;
  $('summary-delivery-fee').textContent = fmt(state.deliveryFee || 0);
} else if($('summary-food-block')){
  $('summary-food-block').remove();
}
$('summary-total').textContent = fmt(state.fare);
$('fare-summary').style.display = 'block';
$('btn-confirm-book').textContent = state.serviceType === 'food'
  ? `Đặt giao đồ ăn - ${fmt(state.fare)}`
  : `Đặt ${state.vehicle.name} - ${fmt(state.fare)}`;
}
function renderPricingOptions(){
  if($('pricing-options')) return;

  $('vehicle-list').insertAdjacentHTML('afterend', `
    <div id="pricing-options" style="margin-top:16px; padding:16px; border-radius:16px; background:#fff; box-shadow:0 4px 14px rgba(0,0,0,0.08);">
      <h3 style="margin-bottom:12px;">Điều kiện tính giá động tự động</h3>
      <p style="font-size:13px; color:#666; margin-bottom:12px;">
         Hệ thống tự dự đoán dựa trên thời tiết, giờ hiện tại, quãng đường và thời gian di chuyển.
      </p>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
  <div>
    <label>Thời tiết</label>
    <div id="weatherText" style="width:100%; padding:12px; border-radius:10px; margin-top:6px; background:#f8fafc; border:1px solid #e5e7eb; font-weight:600;">
      Đang dự đoán...
    </div>
  </div>

  <div>
    <label>Giao thông</label>
    <div id="trafficText" style="width:100%; padding:12px; border-radius:10px; margin-top:6px; background:#f8fafc; border:1px solid #e5e7eb; font-weight:600;">
      Đang dự đoán...
    </div>
  </div>

  <div>
    <label>Nhu cầu đặt xe</label>
    <div id="demandText" style="width:100%; padding:12px; border-radius:10px; margin-top:6px; background:#f8fafc; border:1px solid #e5e7eb; font-weight:600;">
      Đang dự đoán...
    </div>
  </div>

  <div>
    <label>Thời gian</label>
    <div id="timeTypeText" style="width:100%; padding:12px; border-radius:10px; margin-top:6px; background:#f8fafc; border:1px solid #e5e7eb; font-weight:600;">
      Đang dự đoán...
    </div>
  </div>
</div>
  `);
}
function autoPredictRideConditions(){
  const now = new Date();
  const hour = now.getHours();

  const distance = state.realDistanceKm || state.distance || 0;
  const duration = state.realDurationMin || 0;

  let avgSpeed = 35;

  if (distance > 0 && duration > 0) {
    avgSpeed = distance / (duration / 60);
  }

  if ((hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 19)) {
    state.timeType = 'peak';
  } else if (hour >= 22 || hour < 5) {
    state.timeType = 'night';
  } else {
    state.timeType = 'normal';
  }

  if (state.timeType === 'peak') {
    if (avgSpeed < 18) {
      state.traffic = 'jam';
    } else {
      state.traffic = 'heavy';
    }
  } else if (avgSpeed < 12) {
    state.traffic = 'jam';
  } else if (avgSpeed < 20) {
    state.traffic = 'heavy';
  } else if (avgSpeed < 30 || distance > 12) {
    state.traffic = 'medium';
  } else {
    state.traffic = 'light';
  }

  if (state.weather === 'storm') {
    state.demand = 'surge';
  } else if (state.weather === 'rain' && (state.traffic === 'heavy' || state.traffic === 'jam')) {
    state.demand = 'surge';
  } else if (state.timeType === 'peak' && (state.traffic === 'heavy' || state.traffic === 'jam')) {
    state.demand = 'surge';
  } else if (state.timeType === 'night' && distance > 5) {
    state.demand = 'high';
  } else if (state.traffic === 'heavy' || state.traffic === 'jam') {
    state.demand = 'high';
  } else if (distance > 15) {
    state.demand = 'high';
  } else {
    state.demand = 'normal';
  }

  const conditionLabel = {
    weather: {
      normal: 'Bình thường',
      hot: 'Nắng nóng',
      rain: 'Mưa',
      storm: 'Mưa lớn'
    },
    traffic: {
      normal: 'Bình thường',
      light: 'Thông thoáng',
      medium: 'Đông xe',
      heavy: 'Kẹt xe',
      jam: 'Kẹt nặng'
    },
    demand: {
      normal: 'Bình thường',
      low: 'Thấp',
      high: 'Cao',
      surge: 'Rất cao'
    },
    timeType: {
      normal: 'Bình thường',
      peak: 'Giờ cao điểm',
      night: 'Ban đêm'
    }
  };

  if ($('weatherText')) $('weatherText').textContent = conditionLabel.weather[state.weather] || 'Bình thường';
  if ($('trafficText')) $('trafficText').textContent = conditionLabel.traffic[state.traffic] || 'Bình thường';
  if ($('demandText')) $('demandText').textContent = conditionLabel.demand[state.demand] || 'Bình thường';
  if ($('timeTypeText')) $('timeTypeText').textContent = conditionLabel.timeType[state.timeType] || 'Bình thường';

  if (state.vehicle) {
    selectVehicle(state.vehicle.id);
  }
}
async function autoFetchWeather(){
  if(!state.pickup) return;

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${state.pickup.lat}&longitude=${state.pickup.lng}&current=temperature_2m,precipitation,rain,showers,weather_code&timezone=auto`;

    const res = await fetch(url);
    const data = await res.json();

    const current = data.current || {};
    const temp = current.temperature_2m || 0;
    const precipitation = current.precipitation || 0;
    const rain = current.rain || 0;
    const showers = current.showers || 0;
    const weatherCode = current.weather_code || 0;

    if (
      weatherCode === 95 ||
      weatherCode === 96 ||
      weatherCode === 99 ||
      weatherCode === 65 ||
      weatherCode === 82 ||
      precipitation >= 8 ||
      rain >= 8 ||
      showers >= 8
    ) {
      state.weather = 'storm';
    } else if (
      weatherCode === 51 ||
      weatherCode === 53 ||
      weatherCode === 55 ||
      weatherCode === 61 ||
      weatherCode === 63 ||
      weatherCode === 80 ||
      weatherCode === 81 ||
      precipitation > 0 ||
      rain > 0 ||
      showers > 0
    ) {
      state.weather = 'rain';
    } else if (temp >= 34) {
      state.weather = 'hot';
    } else {
      state.weather = 'normal';
    }

    autoPredictRideConditions();

    if(state.vehicle){
      selectVehicle(state.vehicle.id);
    }

    console.log('Thời tiết tự động:', state.weather, {
      temp,
      precipitation,
      rain,
      showers,
      weatherCode
    });
  } catch (error) {
    console.log('Không lấy được thời tiết, dùng mặc định:', error);
    state.weather = state.weather || 'normal';
  }
}
// Autocomplete logic
let acTimer;
function setupAc(inputId, dropId, onSelect){
  const input = $(inputId);
  const drop = $(dropId);
  if(!input || !drop) return;

  input.addEventListener('input', ()=>{
    clearTimeout(acTimer);
    const q = input.value.trim();
    if(q.length < 3){
      drop.style.display = 'none';
      drop.innerHTML = '';
      return;
    }

    acTimer = setTimeout(() => {
      fetchP(q, drop, onSelect, input);
    }, 300);
  });

  document.addEventListener('click', e => {
    if(!input.contains(e.target) && !drop.contains(e.target)){
      drop.style.display = 'none';
    }
  });
}
function fetchP(q, drop, onSelect, input){
  fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q + ', Việt Nam')}&format=json&addressdetails=1&limit=10&countrycodes=vn`)
    .then(r=>r.json()).then(res=>{
      if(!res.length){ drop.style.display='none'; return; }
      drop.innerHTML = res.map((r,i)=>`<div class="ac-item" data-idx="${i}">${r.display_name.split(',').slice(0,3).join(', ')}</div>`).join('');
      drop.style.display='block';
      drop.querySelectorAll('.ac-item').forEach((el,i)=>{
        el.onclick=()=>{
          const r=res[i];
          const name = r.display_name.split(',').slice(0,2).join(', ');
          input.value = name;
          drop.style.display='none';
          onSelect(parseFloat(r.lat), parseFloat(r.lon), name);
        };
      });
    }).catch(() => {
      drop.style.display = 'none';
    });
}
async function reverseGeocode(lat, lng){
  try{
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&zoom=18`;
    const res = await fetch(url);
    const data = await res.json();

    if(data && data.display_name){
      return data.display_name.split(',').slice(0, 4).join(', ');
    }

    return 'Vị trí chưa xác định';
  }catch(err){
    return 'Vị trí chưa xác định';
  }
}
async function reverseGeocode(lat, lng){
  try{
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&zoom=18`;
    const res = await fetch(url);
    const data = await res.json();

    if(data && data.display_name){
      return data.display_name.split(',').slice(0, 4).join(', ');
    }

    return 'Vị trí chưa xác định';
  }catch(err){
    return 'Vị trí chưa xác định';
  }
}

window.confirmBooking = function(){
  if(!state.vehicle){ toast('Vui lòng chọn loại xe'); return; }
  if(state.serviceType === 'food'){
    if(!state.restaurantName){ toast('Vui lòng chọn quán ăn'); return; }
    if(getSelectedFoodItemCount() === 0){ toast('Vui lòng chọn ít nhất 1 món'); return; }
    if(getSelectedFoodQuantity() < 1){ toast('Số lượng món ăn không hợp lệ'); return; }
  }
  if(state.payMethod==='wallet' && state.user.wallet < state.fare){
    toast('Số dư ví không đủ! Vui lòng nạp thêm hoặc đổi phương thức.');
    return;
  }

  updateTrackingLabels();
  showStep('step-tracking');
  
  if(state.payMethod==='wallet'){
    updateWallet(-state.fare);
  }
  
  $('trk-pickup').textContent = state.pickupName;
  $('trk-drop').textContent = state.dropName;
  $('trk-vehicle-emoji').textContent = state.vehicle.emoji;
const trackingPickupMin = state.driverPickupMin || 3;
const trackingRideMin = state.realDurationMin || state.durationMin || Math.max(5, state.distance / 30 * 60);
const trackingTotalMin = trackingPickupMin + trackingRideMin;
const trackingArrival = fmtArrivalTime(trackingTotalMin);

if(!$('trk-duration') && $('trk-drop')){
  $('trk-drop').parentElement.insertAdjacentHTML('afterend', `
    <div id="trk-time-box" style="display:none; margin-top:14px; padding:14px; border-radius:14px; background:#fff7fb; border:1px solid #f9a8d4;">
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
        <span style="color:#6b7280;">Tài xế đến đón sau</span>
        <strong id="trk-pickup-time"></strong>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
        <span style="color:#6b7280;">Thời gian chở khách</span>
        <strong id="trk-duration"></strong>
      </div>
      <div style="display:flex; justify-content:space-between;">
        <span style="color:#6b7280;">Dự kiến tới nơi</span>
        <strong id="trk-arrival"></strong>
      </div>
    </div>
  `);
}

$('trk-pickup-time').textContent = fmtDuration(trackingPickupMin);
$('trk-duration').textContent = fmtDuration(trackingRideMin);
$('trk-arrival').textContent = trackingArrival;
  
  state.rideStep = 0;
  $('trk-progress').style.width = '10%';
  
  
  
  // Create driver marker
  state.driverCandidates = generateDriverCandidates(7);
  state.selectedDriver = state.driverCandidates[0];

  if($('trk-driver-name')) $('trk-driver-name').textContent = 'Đang tìm tài xế...';
  if($('trk-driver-plate')) $('trk-driver-plate').textContent = 'Đang quét quanh bạn';

  const startLat = state.selectedDriver.lat;
  const startLng = state.selectedDriver.lng;
  showDriverCandidatesOnMap();
  const driverPickupMin = state.selectedDriver.pickupMin;

  const rideDurationMin = state.realDurationMin || state.durationMin || Math.max(5, state.distance / 30 * 60);

  state.driverPickupMin = driverPickupMin;
  state.totalTripMin = driverPickupMin + rideDurationMin;
  if($('trk-pickup-time')) $('trk-pickup-time').textContent = fmtDuration(state.driverPickupMin);
  if($('trk-duration')) $('trk-duration').textContent = fmtDuration(rideDurationMin);
  if($('trk-arrival')) $('trk-arrival').textContent = fmtArrivalTime(state.totalTripMin);
  startRadarSearch();
  showCancelLongWait(false);
  
  clearInterval(state.trackInterval);

if (state.animationFrame) {
  cancelAnimationFrame(state.animationFrame);
}

const moveMarkerSmooth = (from, to, duration, onUpdate, onDone) => {
  const startTime = performance.now();

  const animate = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);

    const lat = from.lat + (to.lat - from.lat) * progress;
    const lng = from.lng + (to.lng - from.lng) * progress;

    state.driverMarker.setLatLng([lat, lng]);

    if (onUpdate) onUpdate(progress);

    if (progress < 1) {
      state.animationFrame = requestAnimationFrame(animate);
    } else {
      if (onDone) onDone();
    }
  };

  state.animationFrame = requestAnimationFrame(animate);
};

const getRoutePoint = (coords, progress) => {
  if (!coords || coords.length === 0) {
    return state.drop;
  }

  if (coords.length === 1) {
    return {
      lat: coords[0][0],
      lng: coords[0][1]
    };
  }

  const index = Math.min(
    Math.floor(progress * (coords.length - 1)),
    coords.length - 2
  );

  const localProgress = progress * (coords.length - 1) - index;

  const current = coords[index];
  const next = coords[index + 1];

  return {
    lat: current[0] + (next[0] - current[0]) * localProgress,
    lng: current[1] + (next[1] - current[1]) * localProgress
  };
};
const updateRemainingRoute = (coords, progress) => {
  if (!state.routeLine || !coords || coords.length < 2) return;

  const rawIndex = progress * (coords.length - 1);
  const index = Math.min(Math.floor(rawIndex), coords.length - 2);
  const localProgress = rawIndex - index;

  const current = coords[index];
  const next = coords[index + 1];

  const currentPoint = [
    current[0] + (next[0] - current[0]) * localProgress,
    current[1] + (next[1] - current[1]) * localProgress
  ];

  const remainingRoute = [
    currentPoint,
    ...coords.slice(index + 1)
  ];

  state.routeLine.setLatLngs(remainingRoute);
};

const moveMarkerAlongRoute = (coords, duration, onUpdate, onDone) => {
  const startTime = performance.now();

  const animate = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const point = getRoutePoint(coords, progress);

    state.driverMarker.setLatLng([point.lat, point.lng]);

    if (onUpdate) onUpdate(progress);

    if (progress < 1) {
      state.animationFrame = requestAnimationFrame(animate);
    } else {
      if (onDone) onDone();
    }
  };

  state.animationFrame = requestAnimationFrame(animate);
};
async function getDriverPickupRoute(startLat, startLng){
  try{
    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${state.pickup.lng},${state.pickup.lat}?overview=full&geometries=geojson&steps=true`;
    const res = await fetch(url);
    const data = await res.json();

    if(!data.routes || data.routes.length === 0){
      return [
        [startLat, startLng],
        [state.pickup.lat, state.pickup.lng]
      ];
    }

    return data.routes[0].geometry.coordinates.map(coord => {
      return [coord[1], coord[0]];
    });
  }catch(err){
    return [
      [startLat, startLng],
      [state.pickup.lat, state.pickup.lng]
    ];
  }
}

const pickupAnimTime = Math.min(20000, Math.max(6000, (state.driverPickupMin || 3) * 2000));
const rideAnimTime = Math.min(90000, Math.max(25000, (state.realDurationMin || 10) * 1500));

const findingTime = Math.floor(Math.random() * 3000) + 5000;

$('tracking-title').textContent = state.serviceType === 'food'
  ? 'Đang tìm tài xế giao hàng gần bạn...'
  : 'Đang tìm tài xế gần bạn...';
updateTrackingStep('find');
$('trk-progress').style.width = '8%';

if(state.driverPickupMin >= 7){
  showCancelLongWait(true, state.driverPickupMin, Math.floor(findingTime / 1000));
} else {
  showCancelLongWait(false);
}

state.searchTimeout = setTimeout(async () => {
  $('tracking-title').textContent = state.serviceType === 'food'
    ? `Đã tìm thấy ${state.selectedDriver.name} gần nhất! Tài xế đang đến quán...`
    : `Đã tìm thấy ${state.selectedDriver.name} gần nhất! Tài xế đang đến đón...`;
  updateTrackingStep('coming');
  showCancelLongWait(false);
  if($('trk-time-box')) $('trk-time-box').style.display = 'block';
  if($('trk-pickup-time')) $('trk-pickup-time').textContent = fmtDuration(state.driverPickupMin);
  if($('trk-duration')) $('trk-duration').textContent = fmtDuration(state.realDurationMin || state.durationMin || Math.max(5, state.distance / 30 * 60));
  if($('trk-arrival')) $('trk-arrival').textContent = fmtArrivalTime(state.totalTripMin);
  if($('trk-driver-name')) $('trk-driver-name').textContent = state.selectedDriver.name;
  if($('trk-driver-plate')) $('trk-driver-plate').textContent = state.selectedDriver.plate;
  $('trk-progress').style.width = '15%';
  stopRadarSearch();
  keepOnlySelectedDriverMarker();

const pickupRoute = await getDriverPickupRoute(startLat, startLng);

moveMarkerAlongRoute(
  pickupRoute,
  pickupAnimTime,
  (progress) => {
    $('trk-progress').style.width = `${15 + progress * 35}%`;
  },
  () => {
    $('tracking-title').textContent = state.serviceType === 'food'
      ? 'Đã lấy món, đang di chuyển giao món...'
      : 'Đã đón khách, đang di chuyển đến điểm đến...';
    updateTrackingStep('pickup');


    const route = state.routeCoords && state.routeCoords.length > 0
      ? state.routeCoords
      : [
          [state.pickup.lat, state.pickup.lng],
          [state.drop.lat, state.drop.lng]
        ];

    moveMarkerAlongRoute(
  route,
  rideAnimTime,
  (progress) => {
    $('trk-progress').style.width = `${50 + progress * 50}%`;
    updateRemainingRoute(route, progress);
  },
  () => {
    $('trk-progress').style.width = '100%';
    updateTrackingStep('dropoff');

    if (state.routeLine) {
      state.routeLine.remove();
      state.routeLine = null;
    }

    completeRide();
  }
);
  }
);
}, findingTime);
}

function completeRide(){
  const conditionLabel = {
    weather: {
      normal: 'Bình thường',
      hot: 'Nắng nóng',
      rain: 'Mưa',
      storm: 'Mưa lớn'
    },
    traffic: {
      normal: 'Bình thường',
      light: 'Thông thoáng',
      medium: 'Đông xe',
      heavy: 'Kẹt xe',
      jam: 'Kẹt nặng'
    },
    demand: {
      normal: 'Bình thường',
      low: 'Thấp',
      high: 'Cao',
      surge: 'Rất cao'
    },
    timeType: {
      normal: 'Bình thường',
      peak: 'Giờ cao điểm',
      night: 'Ban đêm'
    }
  };

  const rideDurationMin = state.realDurationMin || state.durationMin || Math.max(5, state.distance / 30 * 60);
  const pickupMin = state.driverPickupMin || 3;
  const totalMin = pickupMin + rideDurationMin;

  const ride = {
    date: new Date().toLocaleString('vi-VN'),
    vehicle: state.vehicle.name,
    pickup: state.pickupName,
    drop: state.dropName,
    fare: state.fare,
    distance: state.distance,
    driverName: state.selectedDriver?.name || 'Tài xế',
    driverPlate: state.selectedDriver?.plate || '',
    pickupMin,
    rideDurationMin,
    totalMin,
    weather: conditionLabel.weather[state.weather] || 'Bình thường',
    traffic: conditionLabel.traffic[state.traffic] || 'Bình thường',
    demand: conditionLabel.demand[state.demand] || 'Bình thường',
    timeType: conditionLabel.timeType[state.timeType] || 'Bình thường',
    rating: 0,
    driverNote: '',
    tip: 0
  };

  const users = JSON.parse(localStorage.getItem('pinkdrive_users') || '[]');
  const u = users.find(x => x.phone === state.user.phone);

  if(u){
    u.rides = u.rides || [];
    u.rides.unshift(ride);
    localStorage.setItem('pinkdrive_users', JSON.stringify(users));
    state.user = u;
  }

  if(!$('receipt-modal')){
  document.body.insertAdjacentHTML('beforeend', `
    <div id="receipt-modal" style="position:fixed; inset:0; background:rgba(15,23,42,0.55); z-index:9999; display:none; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(6px);">
      <div style="width:100%; max-width:540px; background:#fff; border-radius:28px; box-shadow:0 24px 70px rgba(15,23,42,0.35); max-height:92vh; overflow:auto;">
        
        <div style="background:linear-gradient(135deg,#ec4899,#f472b6,#fb7185); color:white; padding:26px 24px; border-radius:28px 28px 0 0; position:relative; overflow:hidden;">
          <div style="position:absolute; width:170px; height:170px; border-radius:50%; background:rgba(255,255,255,0.16); right:-55px; top:-65px;"></div>
          <div style="position:absolute; width:90px; height:90px; border-radius:50%; background:rgba(255,255,255,0.12); left:-25px; bottom:-35px;"></div>

          <div style="position:relative; display:flex; align-items:center; gap:14px;">
            <div style="width:54px; height:54px; border-radius:50%; background:white; display:flex; align-items:center; justify-content:center; box-shadow:0 8px 24px rgba(0,0,0,0.18); overflow:hidden;">
              <img src="pinkdrive-logo.png" alt="PinkDrive" style="width:44px; height:44px; object-fit:contain;">
            </div>
            <div>
              <h2 style="margin:0; font-size:26px;">Chuyến đi hoàn tất</h2>
              <p style="margin:5px 0 0; opacity:0.92;">Cảm ơn bạn đã sử dụng PinkDrive</p>
            </div>
          </div>
        </div>

        <div style="padding:22px 24px 24px;">
          <div id="receipt-content"></div>

          <div style="margin-top:18px; padding:16px; border-radius:22px; background:linear-gradient(135deg,#fff7fb,#fdf2f8); border:1px solid #fbcfe8;">
            <div style="font-weight:900; margin-bottom:10px; color:#1f2937;">Đánh giá tài xế</div>
            <div id="rating-stars" style="font-size:32px; letter-spacing:4px; cursor:pointer; color:#f59e0b;">
              <span data-star="1">☆</span>
              <span data-star="2">☆</span>
              <span data-star="3">☆</span>
              <span data-star="4">☆</span>
              <span data-star="5">☆</span>
            </div>
            <div id="rating-text" style="margin-top:8px; color:#6b7280; font-weight:600;">Chưa đánh giá</div>
          </div>

          <div style="margin-top:18px; padding:16px; border-radius:22px; background:#f9fafb; border:1px solid #e5e7eb;">
<div style="font-weight:900; margin-bottom:10px; color:#1f2937;">Nhận xét tài xế</div>
  <textarea id="driver-note" placeholder="Ví dụ: Tài xế thân thiện, chạy xe an toàn..." style="width:100%; min-height:82px; resize:none; border:1px solid #e5e7eb; border-radius:16px; padding:12px; font-family:inherit; outline:none;"></textarea>
</div>

<div style="margin-top:18px; padding:16px; border-radius:22px; background:#fff7fb; border:1px solid #fbcfe8;">
  <div style="font-weight:900; margin-bottom:10px; color:#1f2937;">Tip cho tài xế</div>
  <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:10px;">
    <button class="tip-btn" data-tip="0" style="padding:10px; border-radius:999px; border:1px solid #f9a8d4; background:white; font-weight:800; cursor:pointer;">Không</button>
    <button class="tip-btn" data-tip="5000" style="padding:10px; border-radius:999px; border:1px solid #f9a8d4; background:white; font-weight:800; cursor:pointer;">5K</button>
    <button class="tip-btn" data-tip="10000" style="padding:10px; border-radius:999px; border:1px solid #f9a8d4; background:white; font-weight:800; cursor:pointer;">10K</button>
    <button class="tip-btn" data-tip="20000" style="padding:10px; border-radius:999px; border:1px solid #f9a8d4; background:white; font-weight:800; cursor:pointer;">20K</button>
  </div>
  <div id="tip-text" style="margin-top:10px; color:#6b7280; font-weight:600;">Chưa thêm tip</div>
</div>
          <button id="btn-new-ride" style="width:100%; margin-top:20px; border:none; background:linear-gradient(135deg,#ec4899,#f472b6); color:white; padding:15px 18px; border-radius:999px; font-weight:900; font-size:16px; cursor:pointer; box-shadow:0 10px 24px rgba(236,72,153,0.28);">
            Đặt chuyến mới
          </button>
        </div>
      </div>
    </div>
  `);
}

  $('receipt-content').innerHTML = `
  <div style="display:grid; gap:16px;">
    
    <div style="text-align:center; padding:18px; border-radius:24px; background:#fff7fb; border:1px solid #fbcfe8;">
      <div style="color:#6b7280; font-weight:700;">Tổng thanh toán</div>
      <div style="font-size:36px; font-weight:1000; color:#ec4899; margin-top:4px;">${fmt(ride.fare)}</div>
      <div style="color:#9ca3af; font-size:13px; margin-top:4px;">${ride.date}</div>
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
      <div style="padding:14px; border-radius:18px; background:#f9fafb; border:1px solid #eef2f7;">
        <div style="color:#6b7280; font-size:13px;">Tài xế</div>
        <div style="font-weight:900; margin-top:4px;">${ride.driverName}</div>
      </div>
      <div style="padding:14px; border-radius:18px; background:#f9fafb; border:1px solid #eef2f7;">
        <div style="color:#6b7280; font-size:13px;">Biển số</div>
        <div style="font-weight:900; margin-top:4px;">${ride.driverPlate}</div>
      </div>
    </div>

    <div style="padding:16px; border-radius:22px; background:white; border:1px solid #fce7f3;">
      <div style="display:flex; gap:12px;">
        <div style="display:flex; flex-direction:column; align-items:center; padding-top:4px;">
          <div style="width:12px; height:12px; border-radius:50%; border:3px solid #ec4899; background:white;"></div>
          <div style="width:2px; height:42px; background:#f9a8d4; margin:4px 0;"></div>
          <div style="width:12px; height:12px; border-radius:50%; background:#ec4899;"></div>
        </div>
        <div style="display:grid; gap:18px; flex:1;">
          <div>
            <div style="color:#6b7280; font-size:13px;">Điểm đón</div>
            <div style="font-weight:900; margin-top:4px;">${ride.pickup}</div>
          </div>
          <div>
            <div style="color:#6b7280; font-size:13px;">Điểm đến</div>
            <div style="font-weight:900; margin-top:4px;">${ride.drop}</div>
          </div>
        </div>
      </div>
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
      <div style="padding:14px; border-radius:18px; background:#f9fafb;">
        <div style="color:#6b7280; font-size:13px;">Loại xe</div>
        <strong>${ride.vehicle}</strong>
      </div>
      <div style="padding:14px; border-radius:18px; background:#f9fafb;">
        <div style="color:#6b7280; font-size:13px;">Khoảng cách</div>
        <strong>${ride.distance.toFixed(1)} km</strong>
      </div>
      <div style="padding:14px; border-radius:18px; background:#f9fafb;">
        <div style="color:#6b7280; font-size:13px;">Tài xế đến đón</div>
        <strong>${fmtDuration(ride.pickupMin)}</strong>
      </div>
      <div style="padding:14px; border-radius:18px; background:#f9fafb;">
        <div style="color:#6b7280; font-size:13px;">Chở khách</div>
        <strong>${fmtDuration(ride.rideDurationMin)}</strong>
      </div>
    </div>

    <div style="padding:16px; border-radius:22px; background:#fdf2f8; border:1px solid #fbcfe8;">
      <div style="font-weight:900; margin-bottom:12px; color:#1f2937;">Điều kiện tính giá động</div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div>🌦️ ${ride.weather}</div>
        <div>🚦 ${ride.traffic}</div>
        <div>🔥 Nhu cầu ${ride.demand}</div>
        <div>🕒 ${ride.timeType}</div>
      </div>
    </div>
  </div>
`;

  let selectedRating = 0;

  document.querySelectorAll('#rating-stars span').forEach(star => {
    star.onclick = () => {
      selectedRating = Number(star.dataset.star);

      document.querySelectorAll('#rating-stars span').forEach(s => {
        s.textContent = Number(s.dataset.star) <= selectedRating ? '★' : '☆';
      });

      $('rating-text').textContent = `Cảm ơn bạn đã đánh giá ${selectedRating}/5 sao 💖`;
      

      ride.rating = selectedRating;

      const latestUsers = JSON.parse(localStorage.getItem('pinkdrive_users') || '[]');
      const latestUser = latestUsers.find(x => x.phone === state.user.phone);

      if(latestUser && latestUser.rides && latestUser.rides.length > 0){
        latestUser.rides[0].rating = selectedRating;
        localStorage.setItem('pinkdrive_users', JSON.stringify(latestUsers));
        state.user = latestUser;
      }
    };
  });
  let selectedTip = 0;

document.querySelectorAll('.tip-btn').forEach(btn => {
  btn.onclick = () => {
    const newTip = Number(btn.dataset.tip);
    const tipDifference = newTip - selectedTip;

    if(tipDifference > 0 && state.user.wallet < tipDifference){
      toast('Số dư ví không đủ để tip thêm cho tài xế');
      return;
    }

    selectedTip = newTip;
    ride.tip = selectedTip;

    if(tipDifference !== 0){
      updateWallet(-tipDifference);
    }

    document.querySelectorAll('.tip-btn').forEach(b => {
      b.style.background = 'white';
      b.style.color = '#1f2937';
    });

    btn.style.background = '#ec4899';
    btn.style.color = 'white';

    $('tip-text').textContent = selectedTip > 0
      ? `Bạn đã tip ${fmt(selectedTip)} cho tài xế. Cảm ơn bạn đã ủng hộ tài xế 💖`
      : 'Không thêm tip';

    const latestUsers = JSON.parse(localStorage.getItem('pinkdrive_users') || '[]');
    const latestUser = latestUsers.find(x => x.phone === state.user.phone);

    if(latestUser && latestUser.rides && latestUser.rides.length > 0){
      latestUser.rides[0].tip = selectedTip;
      latestUser.rides[0].totalPaid = latestUser.rides[0].fare + selectedTip;
      localStorage.setItem('pinkdrive_users', JSON.stringify(latestUsers));
      state.user = latestUser;
    }

    toast(
      selectedTip > 0
        ? `Đã tip ${fmt(selectedTip)} cho tài xế`
        : 'Đã bỏ tip cho tài xế'
    );
  };
});

if($('driver-note')){
  $('driver-note').oninput = e => {
    ride.driverNote = e.target.value.trim();

    const latestUsers = JSON.parse(localStorage.getItem('pinkdrive_users') || '[]');
    const latestUser = latestUsers.find(x => x.phone === state.user.phone);

    if(latestUser && latestUser.rides && latestUser.rides.length > 0){
      latestUser.rides[0].driverNote = ride.driverNote;
      localStorage.setItem('pinkdrive_users', JSON.stringify(latestUsers));
      state.user = latestUser;
    }
  };
}

  $('btn-new-ride').onclick = () => {
    $('receipt-modal').style.display = 'none';
    resetRideForm();
  };

  $('receipt-modal').style.display = 'flex';

  toast('🎉 Chuyến đi hoàn thành!');
}

function resetRideForm(){
  state.pickup = null;
  state.drop = null;
  state.vehicle = null;
  state.pickupName = '';
  state.dropName = '';
  state.fare = 0;
  state.distance = 0;
  state.realDistanceKm = 0;
  state.realDurationMin = 0;
  state.driverPickupMin = 0;
  state.totalTripMin = 0;
  state.routeCoords = [];

  if(state.routeLine) state.routeLine.remove();
  if(state.pickupMarker) state.pickupMarker.remove();
  if(state.dropMarker) state.dropMarker.remove();
  if(state.driverMarker) state.driverMarker.remove();

  clearDriverCandidateMarkers();
  stopRadarSearch();
  showCancelLongWait(false);

  state.routeLine = null;
  state.pickupMarker = null;
  state.dropMarker = null;
  state.driverMarker = null;

  $('input-pickup').value = '';
  $('input-drop').value = '';
  $('fare-summary').style.display = 'none';

  showStep('step-location');
  state.map.setView([10.7769, 106.7009], 13);
}

// USER & UI LOGIC
function updateWallet(amount){
  state.user.wallet += amount;
  const users=JSON.parse(localStorage.getItem('pinkdrive_users')||'[]');
  const u = users.find(x=>x.phone===state.user.phone);
  if(u){ u.wallet=state.user.wallet; localStorage.setItem('pinkdrive_users',JSON.stringify(users)); }
  $('header-wallet-balance').textContent = 'Ví: '+fmt(state.user.wallet);
}

window.loginUser = function(u){
  state.user=u; localStorage.setItem('pinkdrive_current',JSON.stringify(u));
  $('screen-login').style.display='none';
  $('app-main').style.display='flex';
  $('header-name').textContent=u.name;
  $('header-avatar').textContent=u.name[0].toUpperCase();
  $('header-wallet-balance').textContent='Ví: '+fmt(u.wallet);
  setTimeout(async () => {
    initMap();
    initServiceChoice();
    state.map.invalidateSize();
  }, 100);
}

window.logout = function(){
  state.user=null; localStorage.removeItem('pinkdrive_current');
  $('app-main').style.display='none';
  $('screen-login').style.display='flex';
}

window.showHistory = function(){
  const rides = state.user.rides||[];
  $('history-list').innerHTML = rides.length ? rides.map(r=>`
    <div class="hist-item">
      <div class="hist-info">
        <div class="hist-route">📍 ${r.pickup} <br>🏁 ${r.drop}</div>
        <div class="hist-meta">${r.vehicle} • ${r.date}</div>
      </div>
      <div class="hist-price">${fmt(r.fare)}</div>
    </div>
  `).join('') : '<p style="text-align:center;color:var(--text-muted);padding:20px 0;">Bạn chưa có chuyến đi nào.</p>';
  $('modal-history').classList.add('open');
}

window.showTopup = function(){
  $('modal-topup').classList.add('open');
}
window.processTopup = function(){
  const btn = document.querySelector('.topup-btn.selected');
  if(!btn){ toast('Vui lòng chọn mệnh giá nạp'); return; }
  updateWallet(parseInt(btn.dataset.amount));
  $('modal-topup').classList.remove('open');
  toast('Nạp tiền thành công!');
}

document.addEventListener('DOMContentLoaded', ()=>{
  const saved=localStorage.getItem('pinkdrive_current');
  if(saved) loginUser(JSON.parse(saved));
  else $('screen-login').style.display='flex';
  
  // Login Tabs
  document.querySelectorAll('.login-tab').forEach(t=>t.onclick=()=>{
    document.querySelectorAll('.login-tab').forEach(x=>x.classList.remove('active'));
    t.classList.add('active');
    $('login-form').style.display=t.dataset.tab==='login'?'block':'none';
    $('register-form').style.display=t.dataset.tab==='register'?'block':'none';
  });
  
  $('btn-login').onclick=()=>{
    const p=$('login-phone').value, pw=$('login-pw').value;
    if(!p||!pw) return toast('Nhập đầy đủ thông tin');
    const u=(JSON.parse(localStorage.getItem('pinkdrive_users')||'[]')).find(x=>x.phone===p&&x.password===pw);
    if(u) loginUser(u); else toast('Sai thông tin đăng nhập');
  };
  $('btn-register').onclick=()=>{
    const n=$('reg-name').value, p=$('reg-phone').value, pw=$('reg-pw').value;
    if(!n||!p||!pw) return toast('Vui lòng nhập đầy đủ');
    const users=JSON.parse(localStorage.getItem('pinkdrive_users')||'[]');
    if(users.find(x=>x.phone===p)) return toast('SĐT đã tồn tại');
    const u={name:n,phone:p,password:pw,wallet:200000,rides:[]};
    users.push(u); localStorage.setItem('pinkdrive_users',JSON.stringify(users));
    loginUser(u);
  };
  
  // Pay opts
  document.querySelectorAll('.pay-opt').forEach(el=>el.onclick=()=>{
    document.querySelectorAll('.pay-opt').forEach(x=>x.classList.remove('selected'));
    el.classList.add('selected'); state.payMethod=el.dataset.method;
  });
  
  // Topup opts
  document.querySelectorAll('.topup-btn').forEach(el=>el.onclick=()=>{
    document.querySelectorAll('.topup-btn').forEach(x=>x.classList.remove('selected'));
    el.classList.add('selected');
  });
  
  setupAc('input-pickup','drop-pickup',setPickup);
  setupAc('input-drop','drop-drop',setDrop);
});

window.demoLogin = function(){
  const users=JSON.parse(localStorage.getItem('pinkdrive_users')||'[]');
  let demo=users.find(u=>u.phone==='0900000000');
  if(!demo){ demo={name:'Bảo (Demo)',phone:'0900000000',password:'demo123',rides:[],wallet:500000}; users.push(demo); localStorage.setItem('pinkdrive_users',JSON.stringify(users)); }
  loginUser(demo);
}











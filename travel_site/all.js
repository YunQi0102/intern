// 資料處理-只留下需要的六項資料
var newData = []
newData = data.map(record => ({
  name: record.Name,
  zone: record.Zone,
  add: record.Add,
  opentime: record.Opentime,
  tel: record.Tel,
  free: record.Ticketinfo,
  picture: record.Picture1
}));

var dropdown = document.querySelector('.select'); // 下拉選單
var districtName = document.querySelector('.district_name'); // 行政區名
var attractionArea = document.querySelector('.area'); // 景點顯示區域
var pagination = document.querySelector('.page'); // 頁碼
var currentPage = 1; // 當前頁碼
var itemsPerPage = 6; // 每頁顯示幾個景點
var selectedDistrict = ''; // 已選擇的行政區

// 下拉選單
function selectList() {

  // 去除重複行政區並轉成陣列
  var districtSet = new Set(newData.map(item => item.zone));
  var districtArray = Array.from(districtSet);

  // 生成選項
  var optionStr = districtArray.map(zone => `<li class="district_select">${zone}</li>`).join('');
  document.querySelector('.district_option ul').innerHTML = optionStr;
}
selectList();

// 渲染景點資料
function renderAttractions(attractions, page) {
  var startIndex = (page - 1) * itemsPerPage; // 從第幾個景點開始
  var endIndex = startIndex + itemsPerPage; // 顯示到第幾個景點前
  var displayedAttractions = attractions.slice(startIndex, endIndex); // 如果slice(0, 6)就是顯示前6個景點
  var str = '';

  // 顯示當前頁面的六個景點資料
  displayedAttractions.forEach(function (attraction) {

    // 超過字數顯示全文-營業時間
    var businessHoursContent = attraction.opentime.length > 35
      ? `<p class="business_hours toolip">${attraction.opentime}<span class="tooltiptext">${attraction.opentime}</span></p>`
      : `<p class="business_hours">${attraction.opentime}</p>`;
    // 超過字數顯示全文-地址
    var locationContent = attraction.add.length > 35
      ? `<p class="location toolip">${attraction.add}<span class="tooltiptext">${attraction.add}</span></p>`
      : `<p class="location">${attraction.add}</p>`;
    // 超過字數顯示全文-標籤
    var tagContent = attraction.free.length > 7
      ? `<p class="tag_p toolip">${attraction.free}<span class="tooltiptext_tag">${attraction.free}</span></p>`
      : `<p class="tag_p">${attraction.free}</p>`;

    // 景點卡片
    str += `<div class="attraction">
          <div class="attraction_title">
              <img class="attr_img" src="${attraction.picture}" alt="">
              <div class="gradient">
                  <h3 class="attr_name">${attraction.name}</h3>
                  <p class="district">${attraction.zone}</p>
              </div>
          </div>
          <div class="inform">
              <table>
                  <tr>
                      <td style="width: 25px;"><img class="clock" src="img/icons_clock.png"></td>
                      <td>${businessHoursContent}</td>
                  </tr>
                  <tr>
                      <td><img class="location_img" src="img/icons_pin.png"></td>
                      <td>${locationContent}</td>
                  </tr>
                  <tr>
                      <td><img class="phone_img" src="img/icons_phone.png"></td>
                      <td><p class="phone">${attraction.tel}</p></td>
                  </tr>
              </table>
          </div>
          <div class="tag">
              <img class="tag_img" src="img/icons_tag.png">
              ${tagContent}
          </div>
      </div>`;
  });

  // 如果沒抓到資料會顯示"查無資料"
  attractionArea.innerHTML = (str === '') ? '<p class"no_inform">查無資料</p>' : str;
}

// 渲染頁碼顯示
function renderPagination(totalItems, itemsPerPage) {

  // 計算總頁數
  var totalPages = Math.ceil(totalItems / itemsPerPage);
  var paginationStr = '';

  // 上一頁按鈕
  paginationStr += (currentPage > 1)
    ? `<a class="page_number" data-page="${currentPage - 1}">&lt; prev </a>`
    : `<a class="page_number disabled">&lt; prev </a>`;

  // 頁碼
  for (var i = 1; i <= totalPages; i++) {
    paginationStr += (i === currentPage)
      ? `<a class="page_number current" data-page="${i}" disabled>${i}</a>`
      : `<a class="page_number" data-page="${i}">${i}</a>`;
  }

  // 下一頁按鈕
  paginationStr += (currentPage < totalPages)
    ? `<a class="page_number" data-page="${currentPage + 1}"> next &gt;</a>`
    : `<a class="page_number disabled"> next &gt;</a>`;

  // 只有一頁就不顯示頁碼
  pagination.innerHTML = totalPages == 1 ? `` : paginationStr;
}

// 更新景點資料列表和當前頁碼
function updateAttractionPage(selectedDistrict) {

  // 從data篩出選擇的行政區景點資料陣列
  var filteredAttractions = newData.filter(function (attraction) {
    return attraction.zone == selectedDistrict;
  });

  renderAttractions(filteredAttractions, currentPage); // 渲染景點資料
  renderPagination(filteredAttractions.length, itemsPerPage); // 渲染頁碼

  // 頁碼點擊事件
  var pageNumbers = document.querySelectorAll('.page_number');
  pageNumbers.forEach(function (page) {
    page.addEventListener('click', function (e) {

      // 滾動到分隔線位置
      var attractionHeader = document.getElementById('attraction');
      attractionHeader.scrollIntoView({ behavior: 'smooth' });

      // 更新當前頁碼
      var selectedPage = parseInt(e.target.getAttribute('data-page'));
      if (!isNaN(selectedPage)) {
        currentPage = selectedPage;
        updateAttractionPage(selectedDistrict); // 更新景點資料列表和頁碼
      }
    });
  });
}

// 刷新頁面並滾動到分隔線
function updatePageAndScroll(selectedDistrict) {

  // 分隔線
  document.querySelector('.divider').innerHTML = `<hr>
        <img id="attraction" src="img/icons_down2.png" class="separate_icon">`;

  // 下拉選單和行政區名顯示為選取的行政區
  dropdown.textContent = selectedDistrict;
  districtName.textContent = selectedDistrict;

  // 設定當前頁面為第一頁
  currentPage = 1;

  // 滾動到分隔線位置
  var attractionHeader = document.getElementById('attraction');
  attractionHeader.scrollIntoView({ behavior: 'smooth' });

  updateAttractionPage(selectedDistrict); // 更新景點資料列表和頁碼
}

// 行政區選擇
function clickDistrict(e) {
  var selectedDistrict = e.target.textContent;
  updatePageAndScroll(selectedDistrict); // 刷新頁面

  // 讓已選擇的行政區無法再次點擊
  var allOptions = document.querySelectorAll('.district_option ul li, .hot_district ul li');
  allOptions.forEach(function (option) {
    option.classList.remove('current');
  });
  e.target.classList.add('current');
}

// 選擇行政區選項點擊事件
var selectEl = document.querySelectorAll('.district_option ul li');
selectEl.forEach(function (option) {
  option.addEventListener('click', clickDistrict, false);
});

// 熱門行政區點擊事件
var hotEl = document.querySelectorAll('.hot_district ul li');
hotEl.forEach(function (hot) {
  hot.addEventListener('click', clickDistrict, false);
});

// 回到頂端按鈕
function backTop(buttonId, scrollThreshold) {
  var backTopBtn = document.getElementById(buttonId);

  // 頁面滾動
  function handleScroll() {
    if (window.scrollY > scrollThreshold) {
      backTopBtn.classList.add('show');
    } else {
      backTopBtn.classList.remove('show');
    }
  }

  // 頁面滾動事件
  window.addEventListener('scroll', handleScroll);

  // 按鈕點擊事件
  backTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  handleScroll();
}
backTop('go_top', 200);
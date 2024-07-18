var dropdown = document.querySelector('.select');
var districtName = document.querySelector('.district_name');
var attractionArea = document.querySelector('.area');
var pagination = document.querySelector('.page');
var currentPage = 1;
var itemsPerPage = 6;
var selectedDistrict = '';

// 下拉選單
var len = data.length;

var districtList = [];
for (var i = 0; i < len; i++) {
  districtList.push(data[i].Zone);
}

var district = [];
districtList.forEach(function (value) {
  if (district.indexOf(value) == -1) {
    district.push(value);
  }
});

var districtLen = district.length;
var optionStr = '';
for (var i = 0; i < districtLen; i++) {
  optionStr += `<li class="district_select">${district[i]}</li>`;
}
document.querySelector('.district_option ul').innerHTML = optionStr;

// 選項點擊監聽
var selectEl = document.querySelectorAll('.district_option ul li');
selectEl.forEach(function (option) {
  option.addEventListener('click', clickDistrict, false);
});

// 渲染景點資料V
function renderAttractions(attractions, page) {
  var startIndex = (page - 1) * itemsPerPage; // 從第幾個景點開始
  var endIndex = startIndex + itemsPerPage; // 顯示到第幾個景點前
  var displayedAttractions = attractions.slice(startIndex, endIndex); // 如果slice(0, 6)就是顯示前6個景點
  var str = '';

  displayedAttractions.forEach(function (attraction) {

    // 超過字數顯示全文-營業時間
    var businessHoursContent = attraction.Opentime.length > 35
      ? `<p class="business_hours toolip">${attraction.Opentime}<span class="tooltiptext">${attraction.Opentime}</span></p>`
      : `<p class="business_hours">${attraction.Opentime}</p>`;
    // 超過字數顯示全文-地址
    var locationContent = attraction.Add.length > 35
      ? `<p class="location toolip">${attraction.Add}<span class="tooltiptext">${attraction.Add}</span></p>`
      : `<p class="location">${attraction.Add}</p>`;
    // 超過字數顯示全文-標籤
    var tagContent = attraction.Ticketinfo.length > 7
      ? `<p class="tag_p toolip">${attraction.Ticketinfo}<span class="tooltiptext_tag">${attraction.Ticketinfo}</span></p>`
      : `<p class="tag_p">${attraction.Ticketinfo}</p>`;

    // 景點卡片
    str += `<div class="attraction">
          <div class="attraction_title">
              <img class="attr_img" src="${attraction.Picture1}" alt="">
              <div class="gradient">
                  <h3 class="attr_name">${attraction.Name}</h3>
                  <p class="district">${attraction.Zone}</p>
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
                      <td><p class="phone">${attraction.Tel}</p></td>
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

// 渲染頁碼顯示V
function renderPagination(totalItems, itemsPerPage) {

  // 計算總頁數
  var totalPages = Math.ceil(totalItems / itemsPerPage);
  var paginationStr = '';

  // 上一頁按鈕
  paginationStr += (currentPage > 1)
    ? `<span class="page_number" data-page="${currentPage - 1}">&lt; prev </span>`
    : `<span class="page_number disabled">&lt; prev </span>`;

  // 頁碼
  for (var i = 1; i <= totalPages; i++) {
    paginationStr += (i === currentPage)
      ? `<span class="page_number current" data-page="${i}">${i}</span>`
      : `<span class="page_number" data-page="${i}">${i}</span>`;
  }

  // 下一頁按鈕
  paginationStr += (currentPage < totalPages)
    ? `<span class="page_number" data-page="${currentPage + 1}"> next &gt;</span>`
    : `<span class="page_number disabled"> next &gt;</span>`;

  // 只有一頁就不顯示頁碼
  pagination.innerHTML = totalPages == 1 ? `` : paginationStr;
}

// 更新景點資料列表和當前頁碼V
function updateAttractionPage(selectedDistrict) {

  // 從data篩出選擇的行政區景點資料陣列
  var filteredAttractions = data.filter(function (attraction) {
    return attraction.Zone == selectedDistrict;
  });

  renderAttractions(filteredAttractions, currentPage); // 渲染景點資料
  renderPagination(filteredAttractions.length, itemsPerPage); // 渲染頁碼

  // 頁碼點擊監聽
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

// 刷新頁面並滾動到分隔線V
function updatePageAndScroll(selectedDistrict) {
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

// 行政區點擊V
function clickDistrict(e) {
  var selectedDistrict = e.target.textContent;
  updatePageAndScroll(selectedDistrict); // 刷新頁面
}

// 熱門行政區點擊監聽V
var hotEl = document.querySelectorAll('.hot_district ul li');
hotEl.forEach(function (hot) {
  hot.addEventListener('click', clickDistrict, false);
});


// 回到頂端按鈕
var backTopBtn = document.getElementById('go_top');

// 滾動事件處理
function handleScroll() {
  if (window.scrollY > 200) {
    backTopBtn.classList.add('show');
  } else {
    backTopBtn.classList.remove('show');
  }
}

// 返回頂部按鈕點擊事件
backTopBtn.addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 監聽滾動事件
window.addEventListener('scroll', handleScroll);

// 初始狀態處理
handleScroll();
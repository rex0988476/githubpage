class Anime{
    constructor(id, name, img_link, total_score, types){
        this.id = id;
        this.name = name;
        this.img_link = img_link;
        this.total_score = total_score;
        this.types = types;
        this.info = [];

        this.title_row_colspan = 0;//this.info.length+2;
        this.type_row_colspan = 0;//this.info.length+1;

        this.all_season_unwatched_episode = 0;/*所有季總集數-所有季看過的集數*/
        this.all_season_total_episodes = 0;/*所有季總集數*/
    }
    addInfo(year, watched, total, score){
        /*
        //season: 1~n, int, 第x季
        year: 西元年, int, 年份
        watched: 1~n, int, 看過的集數
        total: 1~n, int, 總集數
        date_start: "xx/xx", str, 開始播放日期
        date_end: "xx/xx", str, 結束播放日期
        score: 1.0~10, str, 評分
        */
        this.info.push({year: year, watched: watched, total: total, score: score});
    }
}
var ANIMES = [];
//console.log("當前視窗寬度:", window.innerWidth);
//console.log("當前視窗高度:", window.innerHeight);

// 展開全部anime
const expandButton = document.querySelector(".expand-btn");
expandButton.addEventListener("click", function () {
    inactiveIds = getInactiveAnimeID();
    var i=0;
    while(i<inactiveIds.length){
        toggleAnimeInfo(inactiveIds[i]);
        i++;
    }
});

// 收合全部anime
const collapseButton = document.querySelector(".collapse-btn");
collapseButton.addEventListener("click", function () {
    activeIds = getActiveAnimeID();
    var i=0;
    while(i<activeIds.length){
        toggleAnimeInfo(activeIds[i]);
        i++;
    }
});

// 

document.addEventListener("DOMContentLoaded", function () {
    var sortButtons = document.querySelectorAll(".sort-btn");
    var orderButtons = document.querySelectorAll(".order-btn");
    
    // 設定預設按鈕 (Sort Default & Order Ascending)
    document.querySelector(".sort-btn[data-sort='totalRate']").classList.add("active");
    document.querySelector(".order-btn[data-order='descending']").classList.add("active");
    document.querySelector(".view-mode-card-btn").classList.add("active");

    // 讓 Sort 類別的按鈕，確保只有一個是 active
    sortButtons.forEach(button => {
        button.addEventListener("click", function () {
            sortButtons.forEach(btn => btn.classList.remove("active")); // 移除所有 active
            this.classList.add("active"); // 設定當前按鈕為 active
        });
    });

    // 讓 Order 類別的按鈕，確保只有一個是 active
    orderButtons.forEach(button => {
        button.addEventListener("click", function () {
            orderButtons.forEach(btn => btn.classList.remove("active")); // 移除所有 active
            this.classList.add("active"); // 設定當前按鈕為 active
        });
    });

    // 切換顯示模式
    document.querySelector(".view-mode-card-btn").addEventListener("click", function () {
        document.querySelector(".view-mode-list-btn").classList.remove("active");
        this.classList.add("active");
        
    });
    document.querySelector(".view-mode-list-btn").addEventListener("click", function () {
        document.querySelector(".view-mode-card-btn").classList.remove("active");
        this.classList.add("active");
    });
});

// 升降序
document.querySelectorAll(".order-btn").forEach(button => {
    button.addEventListener("click", function () {
        var order_type = this.getAttribute("data-order");
        sortedData = sortAnimeData("",order_type);
        activeIds = getActiveAnimeID();
        printAnimes(sortedData, activeIds);
    });
});

// 按鈕排序功能
document.querySelectorAll(".sort-btn").forEach(button => {
    button.addEventListener("click", function () {
        var sort_type = this.getAttribute("data-sort");
        sortedData = sortAnimeData(sort_type,"");
        activeIds = getActiveAnimeID();
        printAnimes(sortedData, activeIds);
    });
});

document.addEventListener("DOMContentLoaded", function() {
    fetchExcel(); // 當頁面 DOM 載入後，自動讀取 Excel
});

function calculate_all_season(){
    var i=0;
    var j=0;
    while (i<ANIMES.length){
        j=0;
        while (j<ANIMES[i].info.length){
            ANIMES[i].all_season_unwatched_episode += ANIMES[i].info[j].total - ANIMES[i].info[j].watched;
            ANIMES[i].all_season_total_episodes += ANIMES[i].info[j].total;
            j++;
        }
        i++;
    }
}

default_sort_type = "totalRate";
default_order_type = "descending";   
function sortAnimeData(sort_type, order_type) {
    let sortedData = [...ANIMES]; // 複製數據，避免修改原始數據
    // **取得當前 Sort 的按鈕**
    if (sort_type === ""){
        var activeSortBtn = document.querySelector(".sort-btn.active");
        var activeSortType = activeSortBtn ? activeSortBtn.getAttribute("data-sort") : default_sort_type;
    }
    else{
        var activeSortType = sort_type;
    }
    // **取得當前 Order 的按鈕**
    if (order_type === ""){
        var activeOrderBtn = document.querySelector(".order-btn.active");
        var activeOrderType = activeOrderBtn ? activeOrderBtn.getAttribute("data-order") : default_order_type;
    }
    else{
        var activeOrderType = order_type;
    }
    if (activeOrderType === "ascending") {
        if (activeSortType === "totalRate") {
            sortedData.sort((a, b) => a.total_score - b.total_score);
        } else if (activeSortType === "firstYear") {
            sortedData.sort((a, b) => a.info[0].year - b.info[0].year);
        } else if (activeSortType === "lastYear") {
            sortedData.sort((a, b) => a.info[a.info.length-1].year - b.info[b.info.length-1].year);
        } else if (activeSortType === "progress") {
            sortedData.sort((a, b) => b.all_season_unwatched_episode - a.all_season_unwatched_episode);
        } else if (activeSortType === "totalEpisodes") {
            sortedData.sort((a, b) => a.all_season_total_episodes - b.all_season_total_episodes);
        }
    }
    else if (activeOrderType === "descending") {
        if (activeSortType === "totalRate") {
            sortedData.sort((a, b) => b.total_score - a.total_score);
        } else if (activeSortType === "firstYear") {
            sortedData.sort((a, b) => b.info[0].year - a.info[0].year);
        } else if (activeSortType === "lastYear") {
            sortedData.sort((a, b) => b.info[b.info.length-1].year - a.info[a.info.length-1].year);
        } else if (activeSortType === "progress") {
            sortedData.sort((a, b) => a.all_season_unwatched_episode - b.all_season_unwatched_episode);
        } else if (activeSortType === "totalEpisodes") {
            sortedData.sort((a, b) => b.all_season_total_episodes - a.all_season_total_episodes);
        }
    }
    return sortedData;
}

function getActiveAnimeID() {
    let activeItems = document.querySelectorAll(".anime-item.active"); // 獲取所有帶 active 的元素
    let activeIds = Array.from(activeItems).map(item => item.id); // 取得所有 id
    return activeIds;
}

function getInactiveAnimeID() {
    let inactiveItems = document.querySelectorAll(".anime-item:not(.active)"); // 獲取所有不帶 active 的元素
    let inactiveIds = Array.from(inactiveItems).map(item => item.id); // 取得所有 id
    return inactiveIds;
}


function fetchExcel() {
    //var url = "https://raw.githubusercontent.com/rex0988476/test/main/data.xlsx";
    //var url = "data.xlsx";
    //var url = "http://localhost:8000/data.xlsx";
    var url = "https://raw.githubusercontent.com/rex0988476/githubpage/main/database/data_anime.xlsx";
    //var url = "../database/data_anime.xlsx";

    fetch(url)
    //fetch(url)
        .then(response => response.arrayBuffer()) // 取得 Excel 檔案為 ArrayBuffer
        .then(data => {
            var workbook = XLSX.read(data, { type: "array" });
            //get img links(第二個工作表)
            sheetName = workbook.SheetNames[1]; // 取得第二個工作表名稱
            var sheet_anime_imglinks = workbook.Sheets[sheetName]; //取得第二個工作表
            var anime_img_link_root = sheet_anime_imglinks["C2"].v;//圖片資料夾路徑
            var img_names = [];//所有圖片名稱
            var i=2;
            //start at B2, godown, interval=1, end at the first empty cell
            while(sheet_anime_imglinks["B"+i.toString()] && sheet_anime_imglinks["B"+i.toString()].v && sheet_anime_imglinks["B"+i.toString()].v.toString().trim() !== ""){//單元格不為 undefined、空白或純空格
                img_names.push(sheet_anime_imglinks["B"+i.toString()].v.toString());
                i++;
            }
            //document.write(img_names);
            //get anime(第一個工作表)
            /*
            A row: id, start at A8, godown, interval=4, end at the first empty cell
            B row: anime name, start at B8, godown, interval=4, end at the first empty cell
            C~L row: 
            -year: start at C~L8, godown, interval=4, end at the first empty cell
            -watched: start at C~L9, godown, interval=4, end at the first empty cell
            -total: start at C~L10, godown, interval=4, end at the first empty cell
            -score: start at C~L11, godown, interval=4, end at the first empty cell
            M row: total_score, start at M8, godown, interval=4, end at the first empty cell
            N row: types, start at N8, godown, interval=4, end at the first empty cell
            */
            var sheetName = workbook.SheetNames[0]; // 取得第一個工作表名稱
            var sheet_anime_info = workbook.Sheets[sheetName];// 取得第一個工作表    
            
            var anime_interval = 4;
            var sheet_anime_info_start_row = 6;
            var sheet_anime_info_seasons_start_char = 'C';

            var id = 0;
            var name_ = "";
            var img_link = "";
            var total_score = "";
            var types = "";

            var year = 0;
            var watched = 0;
            var total = 0;
            var score = 0;
            var title_row_colspan=0;//this.info.length+2;
            var type_row_colspan=0;//this.info.length+1;

            i=sheet_anime_info_start_row;
            var j=0;
            var k=0;
            var seasons_char = sheet_anime_info_seasons_start_char;
            while(sheet_anime_info["A"+i.toString()] && sheet_anime_info["A"+i.toString()].v.toString() && sheet_anime_info["A"+i.toString()].v.toString().trim() !== ""){//單元格不為 undefined、空白或純空格
                id = sheet_anime_info["A"+i.toString()].v;
                name_ = sheet_anime_info["B"+i.toString()].v.toString();
                img_link = anime_img_link_root + img_names[j];
                total_score = sheet_anime_info["M"+i.toString()].v;
                if (!(sheet_anime_info["N"+i.toString()] && sheet_anime_info["N"+i.toString()].v && sheet_anime_info["N"+i.toString()].v.toString().trim() !== "")){
                    types = "";
                }
                else{
                    types = sheet_anime_info["N"+i.toString()].v.toString();
                }
                ANIMES.push(new Anime(id, name_, img_link, total_score, types));
                k=0;
                seasons_char = sheet_anime_info_seasons_start_char;
                while(sheet_anime_info[seasons_char+i.toString()] && sheet_anime_info[seasons_char+i.toString()].v && sheet_anime_info[seasons_char+i.toString()].v.toString().trim() !== ""){//單元格不為 undefined、空白或純空格
                    year = sheet_anime_info[seasons_char+i.toString()].v;
                    watched = sheet_anime_info[seasons_char+(i+1).toString()].v;
                    total = sheet_anime_info[seasons_char+(i+2).toString()].v;
                    if (!(sheet_anime_info[seasons_char+(i+3).toString()] && sheet_anime_info[seasons_char+(i+3).toString()].v && sheet_anime_info[seasons_char+(i+3).toString()].v.toString().trim() !== "")){
                        score = "";
                    }
                    else{
                        score = sheet_anime_info[seasons_char+(i+3).toString()].v;
                    }
                    ANIMES[ANIMES.length-1].addInfo(year, watched, total, score);
                    k++;
                    seasons_char = String.fromCharCode(sheet_anime_info_seasons_start_char.charCodeAt(0) + k);
                }
                title_row_colspan=ANIMES[ANIMES.length-1].info.length+2;//this.info.length+2;
                type_row_colspan=ANIMES[ANIMES.length-1].info.length+1;//this.info.length+1;
                ANIMES[ANIMES.length-1].title_row_colspan = title_row_colspan;
                ANIMES[ANIMES.length-1].type_row_colspan = type_row_colspan;
                i+=anime_interval;
                j++;
            }
            calculate_all_season();
            sortedData = sortAnimeData(default_sort_type,default_order_type);
            //activeIds = getActiveAnimeID();
            printAnimes(sortedData);
        })
        .catch(error => console.error("讀取 Excel 失敗", error));
    }

function printAnimes(animes, active_ids_array=[]) {
    var container = document.getElementById("id_container");
    container.innerHTML = ""; // 清空容器

    //var seasons_name = ["第一季", "第二季", "第三季", "第四季", "第五季", "第六季", "第七季", "第八季", "第九季", "第十季"];
    var seasons_name = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10"];
    /*var year_name = "年份";
    var watched_total_name = "看過的集數 / 總集數";
    var release_date_name = "播放日期";
    var score_name = "評分";
    var type_name = "類型";
    var total_score_name = "總評分";
    */
    var year_name = "Year";
    var watched_total_name = "Progress";
    var score_name = "Rate";
    var type_name = "Types";
    var total_score_name = "Total Rate";

    var i=0;
    var j=0;
    var s_container_start="";
    var s_container_end="";
    var s_cover="";
    var s_anime_info="";
    //id on html is "anime_{id}"
    while(i<animes.length){
        //單個作品區塊（可複製多個）
        if (active_ids_array.includes("anime_"+animes[i].id.toString())){
            s_container_start = "<div id=\"anime_"+animes[i].id+"\" class=\"anime-item active\">";
        }
        else{
            s_container_start = "<div id=\"anime_"+animes[i].id+"\" class=\"anime-item\">";
        }
        //左側作品封面（可點擊）
        s_cover = "<div class=\"cover\" onclick=\"toggleAnimeInfo(\'anime_"+animes[i].id.toString()+"\')\">" + "<img src=\""+animes[i].img_link+"\" alt=\"作品"+(i+1).toString()+"封面\">" + "</div>";
        //右側動畫資訊表格（初始隱藏）
        s_anime_info = "<div class=\"anime-info\">" + "<table class=\"anime-table\">";
        //動畫名稱
        s_anime_info += "<tr class=\"title-row\">";//title-row沒做事
        s_anime_info += "<td colspan=\""+animes[i].title_row_colspan.toString()+"\" class=\"anime-name\">"+animes[i].name+"</td>";
        s_anime_info += "</tr>";
        //第x季
        s_anime_info += "<tr class=\"header\">";//header沒做事
        s_anime_info += "<th></th>";
        //迴圈
        j=0;
        while(j<animes[i].info.length){
            s_anime_info += "<th>"+seasons_name[j]+"</th>";
            j++;
        }
        //迴圈end
        s_anime_info += "<th class=\"fixed-width\">"+total_score_name+"</th>";
        s_anime_info += "</tr>";
        //年份
        s_anime_info += "<tr>";
        s_anime_info += "<td>"+year_name+"</td>";
        //迴圈
        j=0;
        while(j<animes[i].info.length){
            s_anime_info += "<td>"+animes[i].info[j].year.toString()+"</td>";
            j++;
        }
        //迴圈end
        s_anime_info += "<td class=\"fixed-width\" rowspan=\"3\">"+animes[i].total_score.toString()+" / 10</td>";
        s_anime_info += "</tr>";
        //看過的集數 / 總集數
        s_anime_info += "<tr>";
        s_anime_info += "<td>"+watched_total_name+"</td>";
        //迴圈
        j=0;
        while(j<animes[i].info.length){
            s_anime_info += "<td>"+animes[i].info[j].watched.toString()+" / "+animes[i].info[j].total.toString()+"</td>";
            j++;
        }
        //迴圈end
        s_anime_info += "</tr>";
        //評分
        s_anime_info += "<tr>";
        s_anime_info += "<td>"+score_name+"</td>";
        //迴圈
        j=0;
        while(j<animes[i].info.length){
            if (animes[i].info[j].score === ""){
                s_anime_info += "<td>-</td>";
            }
            else{
                s_anime_info += "<td>"+animes[i].info[j].score.toString()+" / 10</td>";
            }
            j++;
        }
        //迴圈end
        s_anime_info += "</tr>";
        //類型
        s_anime_info += "<tr>";
        s_anime_info += "<td>"+type_name+"</td>";
        if (animes[i].types === ""){
            s_anime_info += "<td colspan=\""+animes[i].type_row_colspan.toString()+"\">-</td>";
        }
        else{
            s_anime_info += "<td colspan=\""+animes[i].type_row_colspan.toString()+"\">"+animes[i].types+"</td>";
        }
        s_anime_info += "</tr>";
        s_anime_info += "</table>";
        s_anime_info += "</div>";
        //右側動畫資訊表格end
        //單個作品區塊end
        s_container_end = "</div>";
        document.getElementById("id_container").insertAdjacentHTML("beforeend",s_container_start+s_cover+s_anime_info+s_container_end);
        i++;
    }
}
function toggleAnimeInfo(id) {
    //let animeItem = document.querySelectorAll(".anime-item")[index];
    //let animeInfo = document.querySelectorAll(".anime-info")[index];
    //let cover = document.querySelectorAll(".cover")[index];
    let animeItem = document.getElementById(id);
    let animeInfo = document.querySelector(`#${id} .anime-info`);
    let cover = document.querySelector(`#${id} .cover`);
    let animeContainer = document.querySelector(".anime-container");

    animeItem.classList.toggle("active");

    if (animeItem.classList.contains("active")) {//展開
        animeInfo.style.visibility = "hidden";
        animeInfo.style.display = "flex";

        setTimeout(() => {
            let coverHeight = cover.offsetHeight;

            animeInfo.style.width = "70%";
            animeInfo.style.height = `${coverHeight}px`; // **確保高度與封面一致**
            animeInfo.style.visibility = "visible";
        }, 10);
    } else {//收合
        animeInfo.style.width = "0";
        setTimeout(() => {
            animeInfo.style.display = "none";
            animeInfo.style.height = "100%"; // **確保收回時仍然等高**
        }, 300);
    }
    // **檢查有沒有 active 的動畫**
    let anyActive = document.querySelector(".anime-item.active");
    if (anyActive) {
        animeContainer.classList.add("vertical"); // **變成縱向排列**
    } else {
        animeContainer.classList.remove("vertical"); // **恢復橫向排列**
    }

    // **讓展開的動畫滾動到畫面中央**
    if (animeItem.classList.contains("active")) {
        setTimeout(() => {
            animeItem.scrollIntoView({
                behavior: "smooth",  // 平滑滾動
                block: "center",      // 對齊畫面中央
            });
        }, 300); // 確保動畫展開後再滾動
    }

}
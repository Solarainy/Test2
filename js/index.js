var gameConfig = {
    width: 589, //整张图片的宽度
    height: 416, //整张图片的高度
    row: 3, //小方块的行数
    cols: 3, //小方块的列数
    imageurl: "img/3.jpg", //图片的路径
    dom: document.getElementsByClassName("picture-puzzle")[0], //游戏容器的dom
    isOver: false, //游戏是否结束
    minStep: 30,//打乱拼图的最小步数
    maxStep: 100//打乱拼图的最大步数
}

gameConfig.pieceWidth = gameConfig.width / gameConfig.row; //每个小块的宽度
gameConfig.pieceHeight = gameConfig.height / gameConfig.cols; //每个小块的高度

var blocks = []; //存储每个小块的信息

//小方块构造函数
function Block(row, cols) {
    // this.sequenceNumber; //方块的编号从1到（row*cols)-1;空白格编号为0
    this.width = gameConfig.pieceWidth; //宽
    this.height = gameConfig.pieceHeight; //高
    this.correctRow = row; //小方块所在正确的行数，用来判断方块行数是否正确
    this.correctCols = cols; //小方块所在正确的列数，用来判断方块列数是否正确
    this.row = row; //小方块当前所在行数
    this.cols = cols; //小方块当前所在列数
    this.isDisplay = false; //是否是空白块：true.是;false:否;

    this.div = document.createElement("div");
    this.div.style.width = gameConfig.pieceWidth + "px";
    this.div.style.height = gameConfig.pieceHeight + "px";
    this.div.style.background = `url("${gameConfig.imageurl}") -${this.correctCols * this.width}px -${this.correctRow * this.height}px`;
    this.div.style.border = "1px solid #fff";
    this.div.style['box-sizing'] = "border-box";
    this.div.style.position = "absolute";

    this.show = function () { //展示小方块显示的位置
        this.div.style.left = this.cols * gameConfig.pieceWidth + "px";
        this.div.style.top = this.row * gameConfig.pieceHeight + "px";

    }
    this.show();

    if (row === gameConfig.row - 1 && cols === gameConfig.cols - 1) { //最后一方块隐藏
        this.div.style.display = "none";
        this.isDisplay = true; //是否是空白块：true.是;false:否;
    }
    gameConfig.dom.appendChild(this.div);

    this.isCorrect = function () { //判断方块当前位置的行列是否等于正确位置的行列
        if (this.row === this.correctRow && this.cols === this.correctCols) {
            return true;
        }
        return false;
    }
}

//初始化游戏
function init() {
    //1.初始化游戏容器宽度
    initGameDom();
    //2.初始化每个小方块基本信息
    initBlocksArray();
    //3.乱序拼图可解的算法没有看懂，只能程序自动走100步
    // while (!gameConfig.isHaveSolution) {
    randomSort();
    // }
    //4.注册点击事件
    registerEvent();

    //初始化游戏容器
    function initGameDom() {
        gameConfig.dom.style.width = gameConfig.width + "px";
        gameConfig.dom.style.height = gameConfig.height + "px";
        gameConfig.dom.style.border = "2px solid #ccc";
        gameConfig.dom.style.position = "relative";
    }

    //初始化小方块数组信息
    function initBlocksArray() {
        for (var i = 0; i < gameConfig.row; i++) {
            for (var j = 0; j < gameConfig.cols; j++) {
                // 每个小块的基本信息
                var block = new Block(i, j);
                blocks.push(block);
            }
        }
        // blocks.forEach(function (item, index) {
        //     item.sequenceNumber = index + 1;
        // });
        // blocks[gameConfig.row * gameConfig.cols - 1].sequenceNumber = 0; //最后一个空白块编号为0
    }

    //把小方块打乱顺序
    function randomSort() {
        var step = getRandom(gameConfig.minStep, gameConfig.maxStep);//随机在[30,100)区间里取出一个数，作为打乱拼图的步数
        console.log(step);
        //程序自走step步，将拼图顺序打乱
        for (var i = 0; i < step; i++) {
            // 找到空白块所在的行和列
            var blankBlock = blocks.filter(function (item) {
                return item.isDisplay;
            });

            for (var j = 0; j < blocks.length; j++) {
                //判断是否可以交换，横坐标相同则纵坐标相差1||纵坐标相同则横坐标相差为1
                if (blocks[j].row === blankBlock[0].row && Math.abs(blocks[j].cols - blankBlock[0].cols) === 1 ||
                    blocks[j].cols === blankBlock[0].cols && Math.abs(blocks[j].row - blankBlock[0].row) === 1) {
                    exchangeBlocks(blocks[j], blankBlock[0]);
                    continue; //交换一次后进入下个循环，保障交换次数为step次
                }
            }
        }
        // for (var i = 0; i < (gameConfig.row * gameConfig.cols - 1); i++) {
        //     //1.产生一个随机数
        //     //2.将当前小方块信息和随机选中的小方块信息互换，最后一个空白块位置不变
        //     var index = getRandom(0, blocks.length - 2);
        //     //交换数据
        //     exchangeBlocks(blocks[i], blocks[index]);
        // }

        blocks.forEach(function (item) {
            item.show();
        });
        //判断拼图是否有解
        // haveSolution();
    }

    //判断乱序的拼图是否有解
    // function haveSolution() {
    //     var count = 0;
    //     //计算逆序列个数，逆序数：前面的编号大于后面的编号的个数
    //     for (var i = 0; i < blocks.length; i++) {
    //         for (var j = i + 1; j < (blocks.length - 1 - i); j++) {
    //             console.log(i, j, blocks[i].sequenceNumber);
    //             if (blocks[i].sequenceNumber > blocks[j].sequenceNumber) {
    //                 count++;
    //             }
    //         }
    //     }
    //     console.log(count);

    //     //计算空白块编号为0所在的位置
    //     var blankBlock = gameConfig.row * gameConfig.cols - 1;

    //     //奇偶性不同则无解
    //     gameConfig.isHaveSolution = (count % 2 != blankBlock % 2) ? false : true;
    //     console.log(gameConfig.isHaveSolution);
    // }

    //为方块注册事件
    function registerEvent() {
        //找到空白块
        var isDisplayBlock = blocks.find(function (item) {
            return item.isDisplay;
        });
        blocks.forEach(function (item) {
            item.div.onclick = function () {
                if (gameConfig.isOver) { //游戏结束，则不在继续以下操作
                    return;
                }
                //判断是否可以交换，横坐标相同则纵坐标相差1||纵坐标相同则横坐标相差为1
                if (item.row === isDisplayBlock.row && Math.abs(item.cols - isDisplayBlock.cols) === 1 ||
                    item.cols === isDisplayBlock.cols && Math.abs(item.row - isDisplayBlock.row) === 1) {
                    exchangeBlocks(item, isDisplayBlock);
                }
                //游戏结束
                isWin();
            }
        });
    }

    //交换两个方块的位置
    function exchangeBlocks(b1, b2) {
        var temp = b1.row;
        b1.row = b2.row;
        b2.row = temp;

        var temp = b1.cols;
        b1.cols = b2.cols;
        b2.cols = temp;

        // var temp = b1.sequenceNumber;
        // b1.sequenceNumber = b2.sequenceNumber;
        // b2.sequenceNumber = temp;

        b1.show();
        b2.show();
    }

    //游戏结束
    function isWin() {
        var wrongBlocks = blocks.filter(function (item) { //筛选出位置错误的方块
            return !item.isCorrect();
        });
        if (wrongBlocks.length === 0) { //所有方块都在正确位置
            gameConfig.isOver = true; //游戏结束
            blocks.forEach(function (item) {
                item.div.style.display = "block";
                item.div.style.border = "none";
            });
        }
    }
    //-------------通用函数----begin-----------//

    //返回一个[min,max)区间的随机数
    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    //-------------通用函数----end-----------//
}

init();
"use strict"

//BUDGET
let budgetController = (function () {
    let Expanses = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    let Incomes = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    let data = {
        allItems: { //блоки с названими
            inc: [],
            exp: [],
        },
        totals: {   //деньги сколько их всего
            inc: [],
            exp: []
        },
        budget: 0,
        percentage: -1,
    }

    let calculateTotals = function (type) {
        let sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum += cur.value
        })
        data.totals[type] = sum;
    }

    return {
        addItemsIncExp: function (type, des, val) {
            let newItem, ID;

            //Создаем новый ID, если массивы пустые то добавим условие
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1//найдем последний элемент и установим позицию на следующий через + 1
            } else {
                ID = 0;
            }

            //Создаем новый элемент в зависимости от типа который получает из getInputs
            if (type === 'exp') {
                newItem = new Expanses(ID, des, val)
            } else if (type === 'inc') {
                newItem = new Incomes(ID, des, val)
            }

            data.allItems[type].push(newItem) //пушим в зависимости от типа в структурру данных

            //возвращаем новый элемент
            return newItem
        },

        deleteItem: function (type, id) {//нам нужно какой будет тип inc or exp а также его id
            let indx, ids;

            //id = 10
            //data.allItems[type][id] работать просто так не будет только если хардкодить
            //ids будет хранить другой результат через map
            ids = data.allItems[type].map(function (current) {
                return current.id
            })

            indx = ids.indexOf(id)

            if (indx !== -1) {
                data.allItems[type].splice(indx, 1)
            }


        },

        calculateBudget: function () {
            //Вычислить общие доходы и расходы по функции calculateTotals для [type]
            calculateTotals('exp');
            calculateTotals('inc');

            //Вычислить разницу и записать в структуру данных
            data.budget = data.totals.inc - data.totals.exp

            //Вычислить процент между доходов и расходов
            if (data.percentage > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100)
            } else {
                data.percentage = -1;
            }
        },
        //Помним да что можно передать объект а не куча переменных

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        //testing
        testing: function () {
            console.log(data)
        }
    }
})();





//UI
let UIController = (function () {
    let DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        addBtn: '.add__btn',
        incomeList: '.income__list',
        exprensesList: '.expenses__list',
        totalBudget: '.budget__value',
        incomeBudget: '.budget__income--value',
        expensesBudget: '.budget__expenses--value',
        percentageBudget: '.budget__expenses--percentage',
        container: '.container'
    }


    return {

        DOMStrings: function () { // let DOMstrings
            return DOMstrings
        },

        getInputs: function () {//Читаем пользовательские инпуты
            return {
                type: document.querySelector(DOMstrings.inputType).value, //inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },

        addListItem: function (obj, type) {
            let html, newHtml, element;

            if (type === 'inc') {
                element = DOMstrings.incomeList //доступ к DOMSctrings имеет напрямую
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'exp') {
                element = DOMstrings.exprensesList //доступ к DOMSctrings имеет напрямую
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            //Заменим в коде на акутальные данные которые пользователь вбил
            newHtml = html.replace('%id%', obj.id)
            newHtml = newHtml.replace('%description%', obj.description)
            newHtml = newHtml.replace('%value%', obj.value)

            //Вставим этот кусок кода в HTML методов insertAdjacentHTML
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml) //в элементе хранится класс
        },

        clearFields: function () {
            let fields, fieldsArray;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);//получился список из-за quuerySelectorAll
            fieldsArray = [...fields]; //преобразовываем список в массив чтобы пройтись по каждому из элементов для удаления
            fieldsArray.forEach(function (currentValue, index, array) {
                currentValue.value = "";//для кадлого поля ззануляем 
            })
            fieldsArray[0].focus() //фокус на поле описание
        },

        displayData: function (obj) {
            document.querySelector(DOMstrings.totalBudget).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeBudget).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesBudget).textContent = obj.totalExp;

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageBudget).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageBudget).textContent = '---';
            }
        },
        
        deleteListItem: function(selectorID) {
            let el = document.getElementById(selectorID)
            el.parentNode.removeChild(el)
        }
    }

})();


//MAIN
let appController = (function (budgetCtr, UICtr) {

    let initiallizationFunc = function () {
        let DOMs = UICtr.DOMStrings() //вызвать надо обязательно! Переменные имена из UI
        UICtr.clearFields(); //необязательно но можно оставить пока
        document.querySelector(DOMs.addBtn).addEventListener('click', addBtnItem) //просто вернем функцию callback для addEventListener

        document.addEventListener('keypress', function (event) { //сдесь будем вызывать функцию addBtnItem в зависимости от условия вместо event любая другая переменная
            if (event.keyCode === 13 && event.which === 13) {
                addBtnItem();
            }
        });

        //Нажатие на кнопку удаления, будет вызываться callback-функция cctrlDeleteItem
        document.querySelector(DOMs.container).addEventListener('click', ctrlDeleteItem)
    }

    let updateBudget = function () {
        let budget;
        //1. Вычисляем бюджет
        budgetCtr.calculateBudget();

        //2. Возвращаем значение бюджета
        budget = budgetCtr.getBudget()

        //3. Отображаем это значение на UI?
        // console.log(budget)
        UICtr.displayData(budget)
    }

    let addBtnItem = function () {
        let input, newItem;

        //1. Как нажимает на кнопку мы должны получить данные
        input = UICtr.getInputs();

        //Предотвратим ввод пустых данных 
        //больше нуля чтобы нельзя было пульнуть данные отрицательные
        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {

            //2. Добавить элемент в budgetController
            newItem = budgetController.addItemsIncExp(input.type, input.description, input.value); //так как мы хотим получить type,description и value то нужно передать их в функцию addItemsIncExp 

            //3. Добавить отображение в UI
            UICtr.addListItem(newItem, input.type)

            //4. Очистить поля после заполнения и устоновить указатель на блок описания
            UICtr.clearFields()
        } else {

        //5. Вычислить и обновить бюджет
        updateBudget();

        //6. Отобразить этот бюджет на UI
        }
    };

    let ctrlDeleteItem = function (event) {
        let itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id


        if (itemID) {
            //itemID is a "inc-0", "inc-1" and etc.
            splitID = itemID.split('-') // ["inc", "0"]
            type = splitID[0] //[inc] or [exp]
            ID = parseInt(splitID[1])

            //1. Удалить предмет из структуры данных
            budgetCtr.deleteItem(type, ID)

            //2. Удалить предмет из UI
            UICtr.deleteListItem(itemID)

            //3. обновить и отобразить новый бюджет
            updateBudget();
        }

    }
    return {
        init: function () {
            console.log('APP started...init function');
            initiallizationFunc();
            UICtr.displayData({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            })
        }
    }
})(budgetController, UIController);

appController.init()
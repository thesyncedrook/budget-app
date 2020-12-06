
var budgetController = (function () {

    var Income = function (id, description, value) {
        this.id = id,
            this.description = description,
            this.value = value
    }
    var Expense = function (id, description, value) {
        this.id = id,
            this.description = description,
            this.value = value
        this.percentage = -1
    }
    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100)
        }
        else {
            this.percentage = -1
        }
    }
    Expense.prototype.getPercentage = function () {
        return this.percentage
    }
    var calculateTotal = function (type) {
        var total = 0;
        data.allItems[type].forEach(function (cur) {
            total += cur.value
        })
        data.totals[type] = total
    }
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: [],
            inc: []
        },
        budget: 0,
        percentage: -1
    }
    return {
        addItem: function (type, des, val) {
            var newItem, ID;
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            else {
                ID = 0;
            }
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },
        calculateBudget: function () {
            calculateTotal('inc')
            calculateTotal('exp')
            data.budget = data.totals.inc - data.totals.exp
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100)
            }
        },
        calculatePercentages: function () {
            data.allItems.exp.forEach(function (cur) {
                cur.calcPercentage(data.totals.inc)
            })
        },
        getPercentages: function () {
            var allPerc = data.allItems.exp.map(function (current) {
                return current.getPercentage()
            })
            return allPerc
        },
        getBudget: function () {
            return {
                budget: data.budget,
                totolInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
        deleteItem: function (type, id) {
            var ids, index

            ids = data.allItems[type].map(function (current) {
                return current.id
            })
            index = ids.indexOf(id)
            if (index !== -1) {
                data.allItems[type].splice(index, 1)
            }
        },
        testing: function () {
            console.log(data)
            //console.log(this)
        }
    }
})()


var UIController = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    var nodeListForEach = function (list, callback) {
        for (let index = 0; index < list.length; index++) {
            callback(list[index], index)
        }
    }

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },
        getDOMStrings: function () {
            return DOMstrings;
        },
        addListItem: function (obj, type) {
            var html, element, newHtml;
            if (type === 'exp') {
                element = DOMstrings.expensesContainer
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage" > 21 %</div ><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div > </div > '
            } else if (type === 'inc') {
                element = DOMstrings.incomeContainer
                html = ' <div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            newHtml = html.replace('%id%', obj.id)
            newHtml = newHtml.replace('%description%', obj.description)
            newHtml = newHtml.replace('%value%', obj.value)

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)
        },
        deleteListItem: function (selectorID) {
            var elementToRemove = document.getElementById(selectorID)
            elementToRemove.parentNode.removeChild(elementToRemove)
        },
        clearFields: function () {
            var fields, fieldsArray
            fields = document.querySelectorAll(DOMstrings.inputValue + ',' + DOMstrings.inputDescription)
            fieldsArray = Array.prototype.slice.call(fields)
            fieldsArray.forEach(function (current, index, array) {
                current.value = ""
            })
            fieldsArray[0].focus()
        },
        displayBudget: function (obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totolInc
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%'
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---'
            }
        },
        displayPercentages: function (percentages) {
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel)

            nodeListForEach(fields, function (current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%'
                }
                else {
                    current.textContent = '---'
                }
            })
        },
        changedType: function () {
            var fields = document.querySelectorAll(DOMstrings.inputType + ',' + DOMstrings.inputValue + ',' + DOMstrings.inputDescription)
            nodeListForEach(fields,function(current){
                current.classList.toggle('red-focus')
            })
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red')
        },
        displayMonth:function(){
            var now, months ,month,year

            now =new Date()
            month= now.getMonth()
            year = now.getFullYear()
            months =['January','February','March','April','May','June','July','August','September','October','November','December']
            document.querySelector(DOMstrings.dateLabel).textContent=months[month]+' '+year
        }
    }
})()


//GLOBAL CONTROLLER
var controller = (function (budgetCtrl, UIctrl) {

    var setupEventListeners = function () {
        var DOM = UIctrl.getDOMStrings()
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem)
        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13) {
                ctrlAddItem()
            }
        })
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)
        document.querySelector(DOM.inputType).addEventListener('change', UIctrl.changedType)
    }
    var updateBudget = function () {
        var budget
        budgetCtrl.calculateBudget();
        budget = budgetCtrl.getBudget()
        UIctrl.displayBudget(budget)
    }
    var updatePercentages = function () {
        budgetCtrl.calculatePercentages()
        var percentages = budgetCtrl.getPercentages()
        console.log(percentages)
        UIctrl.displayPercentages(percentages)
    }

    var ctrlAddItem = function () {
        var input, newItem;
        input = UIctrl.getInput()
        if (!(input.description === "") && !isNaN(input.value) && input.value > 0) {
            newItem = budgetCtrl.addItem(input.type, input.description, input.value)
            UIctrl.addListItem(newItem, input.type)
            UIctrl.clearFields()
            updateBudget()
            updatePercentages()
        }
    }
    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, ID
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0]
            ID = parseInt(splitID[1])

            budgetCtrl.deleteItem(type, ID)
            UIctrl.deleteListItem(itemID)
            updateBudget()
            updatePercentages()
        }
    }
    return {
        init: function () {
            console.log('Application has started.')
            UIctrl.displayMonth()
            UIctrl.displayBudget({
                budget: 0,
                totolInc: 0,
                totalExp: 0,
                percentage: -1
            })
            setupEventListeners()
        }
    }
})(budgetController, UIController)

controller.init()
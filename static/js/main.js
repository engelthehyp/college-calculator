var schools;

function setup() {
    createCanvas(windowWidth, windowHeight);
    schools = new Schools();

    var i = [];//input fields

    i[0] = createInput();
    i[0].size(100);
    i[0].position(windowWidth / 2 - i[0].width * 2, windowHeight / 2);
    i[0].attribute("placeholder", "school name");

    i[1] = createInput();
    i[1].size(50);
    i[1].position(i[0].x + i[0].width, windowHeight / 2);
    i[1].attribute("placeholder", "acc rate");

    var buttonsWidth = 0;
    i.forEach((e) => { buttonsWidth += e.width });

    addBtn = createButton('add');
    addBtn.position(i[0].x + buttonsWidth, i[0].y);
    addBtn.mousePressed(() => { schools.add(i[0].value(), parseInt(i[1].value())) });

    saveBtn = createButton('save');
    saveBtn.position(i[0].x + buttonsWidth + addBtn.width, i[0].y);
    saveBtn.mousePressed(_save);

    clearBtn = createButton('clear');
    clearBtn.position(i[0].x + buttonsWidth + addBtn.width + saveBtn.width, i[0].y);
    clearBtn.mousePressed(_clear);

    calcBtn = createButton('calculate chance');
    calcBtn.position(i[0].x + buttonsWidth + addBtn.width + saveBtn.width + clearBtn.width, i[0].y);
    calcBtn.mousePressed(() => { console.log(schools.calculate()) });

    txt = createElement('p', 'loading...');
    txt.position(i[0].x, i[0].y + i[0].height / 2);

    //storeItem("data", '{"school":[{"name":"hello","rate":10}]}');
    if (getItem("data") != null && getItem("data" != "")) {
        console.log(getItem("data"));
    } else {
        console.log("askfhkas");
        storeItem("data", '{"school":[]}');
    }
    schools.populate(JSON.parse(getItem("data")));
    txt.html(schools.getJSON());

}

function draw() { }

function _save() {
    storeItem("data", schools.getJSON());
    schools.populate(JSON.parse(getItem("data")));
    console.log("saved to item");
    updateTxt();
}

function _clear() {
    storeItem("data", '{"school":[]}');
    schools.populate(JSON.parse(getItem("data")));
    updateTxt();
}

function updateTxt() {
    txt.html(getItem("data"));
}

class Schools {
    constructor() {
        this.schools = [];
    }
    getJSON() {
        var tmp = { school: [] };
        this.schools.forEach((e) => {
            tmp.school.push({ "name": e.getName(), "rate": e.getRate() });
        });
        return JSON.stringify(tmp);
    }
    getArray() {
        return this.schools;
    }
    populate(items) {
        this.schools = [];
        items.school.forEach((e) => {
            this.schools.push(new School(e.name, e.rate));
        });
    }
    add(name, rate) {//str,double
        this.schools.push(new School(name, rate));
        txt.html(this.getJSON());
        _save();
    }
    calculate() {
        var probability = 1;//no idea where I got these equations from
        for (var x = 0; x < this.schools.length; x++) {
            probability *= this.schools[x].getRate() / 100;
        }
        probability = (1 - probability) * 100;
        console.log(probability + "% chance to get into at least one of the " + this.schools.length + " schools.");
        return probability;
    }
}

class School {
    constructor(_name, _rate) {
        this.name = _name;
        this.rate = _rate;
    }
    //setters
    setName(_name) {
        this.name = _name;
    }
    setRate(_rate) {
        this.rate = _rate;
    }
    //getters
    getName() {
        return this.name;
    }
    getRate() {
        return this.rate;
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

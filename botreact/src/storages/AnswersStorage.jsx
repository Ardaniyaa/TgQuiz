import { configure } from "mobx"
import { makeAutoObservable, runInAction, reaction } from "mobx"

class AnswersStorage {

    constructor() {
        makeAutoObservable(this)
    }
    
    answersCount = 0;

    countIterate() {
        this.answersCount += 1
    }
}

export default AnswersStorage;
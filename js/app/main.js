import Controller from "./Controller.js";
import DataManager from "../data/DataManager.js";
import ViewManager from "../view/ViewModule.js";
import constants from "../util/constants.js";

/*====== 실행 부분 ========*/
const viewManager = new ViewManager();
const dataManager = new DataManager(constants['LOCAL_STORAGE_KEY']);
const mainController = new Controller(viewManager, dataManager);
mainController.run();
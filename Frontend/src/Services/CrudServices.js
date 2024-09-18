import Configuration from "../Configuration/Configuration";
import Axios from "./AxiosServices";

const axios = new Axios();
//const Config = new Configuration();

export default class CrudServices  {
  LoginRecord(data) {
    console.log("Data: " + JSON.stringify(data) + " | URL: " + Configuration.LoginRecord);
    return axios.post(Configuration.LoginRecord, data, false);
  }

  ImageUpload(formData) {
    return axios.filePost(Configuration.FileUpload, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Ensure this header is set
      },
    });
  }
  CreateRecord(data) {
    console.log("Data: " + JSON.stringify(data) + " | URL: " + Configuration.CreateRecord);
    return axios.post(Configuration.CreateRecord, data, true);
  }

  UpdateRecord(data) {
    console.log("Data: " + JSON.stringify(data) + " | URL: " + Configuration.UpdateRecord);
    return axios.put(Configuration.UpdateRecord, data, true);
  }
  ReadRecord() {
    console.log("URL: " + Configuration.GetRecord);
    return axios.get(Configuration.GetRecord, true);
  }

  MenuRecord() {
    console.log("URL: " + Configuration.MenuRecord);
    return axios.get(Configuration.MenuRecord, true);
  }

  SubMenuRecord(menuId) {
    // Ensure only menu_id is sent in the payload
    const payload = {
      menu_id: menuId,
      user_id: localStorage.getItem('user_id')
    };
  
    console.log("Data: " + JSON.stringify(payload) + " | URL: " + Configuration.SubMenuRecord);
  
    // Make the POST request with the correct URL and payload
    return axios.post(Configuration.SubMenuRecord, payload, { 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Add token to Authorization header if required
      }
    });
  }
  
  DeleteRecord(data) {
    console.log("Data: " + JSON.stringify(data) + " | URL: " + Configuration.DeleteRecord);
    return axios.put(Configuration.DeleteRecord, data, true);
  }

  GetRole() {
    console.log("URL: " + Configuration.GetRole);
    return axios.get(Configuration.GetRole, false);
  }

}

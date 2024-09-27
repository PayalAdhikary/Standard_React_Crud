import React, { Component } from "react";
import "./HomePage.scss";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CrudServices from "../Services/CrudServices";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add"; // Import Plus Icon
import { styled } from "@mui/system";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { FormControl, Autocomplete } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Padding } from "@mui/icons-material";

const service = new CrudServices();

const VisuallyHiddenInput = styled("input")({
  display: "none",
});

const ImagePreviewContainer = styled("div")({
  marginTop: "10px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const ImagePreview = styled("img")({
  maxWidth: "100%",
  maxHeight: "100px",
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  marginTop: "10px",
});

const FileDetails = styled("div")({
  marginTop: "20px",
  textAlign: "center",
});

export default class HomePage extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      name: "",
      email: "",
      mobile: "",
      img: "", // This will hold the URL of the uploaded image
      file: null,
      preview: null, // This will show the local file preview before uploading
      uploading: false,
      response: null,
      error: null,
      DataRecord: [],
      MenuDataRecord: [],
      RoleDataRecord: [],
      UpdateFlag: false,
      modalOpen: false,
      role_id: "",
      role: "", // State to control modal visibility
    };
  }

  componentDidMount() {
    this.ReadRecord();
    this.MenuRecord();
    this.RoleRecord();
  }

  MenuRecord() {
    service
      .MenuRecord()
      .then((data) => {
        this.setState({ MenuDataRecord: data.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  RoleRecord() {
    service
      .GetRole()
      .then((data) => {
        console.log(data);
        this.setState({ RoleDataRecord: data.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleRoleChange = (event, newValue) => {
    if (newValue) {
      this.setState({ role_id: newValue.role_id, role: newValue.name });
    }
  };

  ReadRecord() {
    service
      .ReadRecord()
      .then((data) => {
        this.setState({ DataRecord: data.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      this.setState({ file: selectedFile });
      const reader = new FileReader();
      reader.onloadend = () => {
        this.setState({ preview: reader.result });
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  handleUpload = () => {
    const { file } = this.state;
    if (!file) {
      alert("Please choose a file before uploading");
      return;
    }

    this.setState({ uploading: true, error: null });

    const formData = new FormData();
    formData.append("File", file);

    service
      .ImageUpload(formData)
      .then((response) => {
        this.setState({
          response: response.data,
          img: response.data.fullUrlPath, // Store the image URL from the response
        });
        //alert("File uploaded successfully");
      })
      .catch(() => {
        this.setState({ error: "File upload failed, please try again" });
      })
      .finally(() => {
        this.setState({ uploading: false, file: null, preview: null });
      });
  };

  handleClick = () => {
    if (
      this.state.name === "" ||
      this.state.email === "" ||
      this.state.mobile === "" ||
      this.state.img === "" ||
      this.state.role_id === ""
    ) {
      Swal.fire({
        icon: "warning",
        title: "Input Error",
        text: "Please fill all the fields",
      });
      return;
    }

    const data = {
      name: this.state.name,
      email: this.state.email,
      mobile: this.state.mobile,
      img: this.state.img,
      role_id: this.state.role_id,
    };

    const action = this.state.UpdateFlag
      ? service.UpdateRecord({ ...data, id: this.state.id })
      : service.CreateRecord(data);

    action
      .then((response) => {
        const message =
          response.data.executeMessage || "Operation completed successfully";
        Swal.fire({
          icon: "success",
          title: "Success",
          text: message,
        });
        this.ReadRecord();
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Something went wrong",
        });
      });

    this.setState({
      id: "",
      name: "",
      email: "",
      mobile: "",
      img: "",
      role_id: "",
      preview: null,
      UpdateFlag: false,
      modalOpen: false,
    });
  };

  handleEdit = (data) => {
    this.setState({
      id: data.id,
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      img: data.img,
      role_id: data.role_id, // Set the role_id for the Autocomplete
      role: data.role,
      UpdateFlag: true,
      modalOpen: true, // Open the modal when editing
    });
  };

  handleDelete = (data) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        service
          .DeleteRecord({ id: data.id })
          .then(() => {
            this.setState({
              DataRecord: this.state.DataRecord.filter(
                (record) => record.id !== data.id
              ),
            });
            Swal.fire("Deleted!", "The record has been deleted.", "success");
          })
          .catch((error) => {
            Swal.fire("Error", "An error occurred while deleting", "error");
          });
      }
    });
  };

  handleModalOpen = () => {
    this.setState({ modalOpen: true });
  };

  handleModalClose = () => {
    this.setState({ modalOpen: false });
  };

  render() {
    let state = this.state;
    let Self = this;
    return (
      <div className="MainContainer">
        <div className="SubContainer">
          <div className="flex-Container">
            {localStorage.getItem("dept") === "Admin" ? (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={this.handleModalOpen}
                style={{ marginBottom: "20px" }}
              >
                Add New Record
              </Button>
            ) : (
              <div></div>
            )}
          </div>
          {/* Modal with Box 1 contents */}
          <Modal open={this.state.modalOpen} onClose={this.handleModalClose}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 500,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: "10px",
              }}
            >
              <div className="ModalBox">
                <div className="Header" style={{ textAlign: "center" ,background: "#4F75FF", height: "50px",borderRadius:"10px"}}>
                <h3 style={{ textAlign: "center",padding:"10px" ,color:"white"}}>
                  {this.state.UpdateFlag ? "Edit User" : "Create User"}
                </h3>
                </div>
                <div className="Input-Container-Modal">
                  <div className="flex-Container">
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      size="small"
                      variant="outlined"
                      value={this.state.name}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="flex-Container">
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      size="small"
                      variant="outlined"
                      value={this.state.email}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="Input-Container-Modal">
                  <div className="flex-Container">
                    <TextField
                      fullWidth
                      label="Mobile No."
                      name="mobile"
                      size="small"
                      variant="outlined"
                      value={this.state.mobile}
                      onChange={this.handleChange}
                    />
                  </div>

                  {/* <FormControl fullWidth size="small" variant="outlined" s> */}
                  <Autocomplete
                    fullWidth
                    size="small"
                    className="flex-Container"
                    options={this.state.RoleDataRecord || []}
                    getOptionLabel={(option) => option.role || ""}
                    value={
                      this.state.RoleDataRecord.find(
                        (role) => role.id === this.state.role_id
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      if (newValue) {
                        this.setState({
                          role_id: newValue.id,
                          role: newValue.role,
                        });
                      } else {
                        this.setState({ role_id: "", role: "" });
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        size="small"
                        {...params}
                        label="Department"
                        variant="outlined"
                      />
                    )}
                  />
                  {/* </FormControl> */}
                </div>

                {/* Image Upload Section */}
                <div className="flex-Container">
                  <label htmlFor="file-upload">
                    <VisuallyHiddenInput
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={this.handleFileChange}
                    />
                    <Button
                      variant="contained"
                      component="span"
                      startIcon={<CloudUploadIcon />}
                      style={{ marginTop: "5px", marginBottom: "10px" }}
                      size="small"
                    >
                      Choose Image
                    </Button>
                  </label>
                </div>
                {/* Preview Image Before Upload */}
                {this.state.preview && (
                  <ImagePreviewContainer>
                    <ImagePreview
                      src={this.state.preview}
                      alt="Selected Preview"
                    />
                    <FileDetails>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleUpload}
                        style={{ marginTop: "5px", marginBottom: "10px" }}
                        size="small"
                      >
                        Upload Image
                      </Button>
                    </FileDetails>
                  </ImagePreviewContainer>
                )}
                {/* Uploaded Image After API Upload */}

                {!this.state.preview && this.state.img && (
                  <ImagePreviewContainer>
                    <ImagePreview src={this.state.img} alt="Uploaded Image" />
                    {/* <p>Profile photo set successfully!</p> */}
                  </ImagePreviewContainer>
                )}
                {/* Save/Cancel Buttons */}
                <div
                  className="Button-Container"
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "20px",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleClick}
                    style={{ marginRight: "10px" }}
                    size="small"
                  >
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    style={{ color: "white", background: "gray" }}
                    onClick={this.handleModalClose}
                    size="small"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Box>
          </Modal>

          {/* Displaying data */}
          <div className="Box2">
            {Array.isArray(this.state.DataRecord) &&
            this.state.DataRecord.length > 0 ? (
              this.state.DataRecord.map(function (data, index) {
                return (
                  <div key={index} className="data-flex">
                    <div className="UserName">
                      <img
                        src={data.img}
                        alt={data.img}
                        width={50}
                        height={50}
                        style={{ borderRadius: "50%" }}
                      />
                    </div>
                    <div className="UserName">{data.name}</div>
                    <div className="Department">{data.role}</div>
                    {localStorage.getItem("dept") === "Admin" ? (
                      <div className="Update">
                        <Button
                          variant="outlined"
                          onClick={() => Self.handleEdit(data)}
                        >
                          <EditIcon />
                        </Button>
                      </div>
                    ) : (
                      <div></div>
                    )}

                    {localStorage.getItem("dept") === "Admin" ? (
                      <div className="Delete">
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => Self.handleDelete(data)}
                        >
                          <DeleteIcon />
                        </Button>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                );
              })
            ) : (
              <div>No Data Found</div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

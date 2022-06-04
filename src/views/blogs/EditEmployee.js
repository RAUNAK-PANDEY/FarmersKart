import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner,
  CInput,
  CButton,
  CForm,
  CFormGroup,
  CLabel,
  CProgress,
  CProgressBar,
  CCol,
  CRow,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { useHistory } from "react-router";
import { useFormik } from "formik";

const EditEmployee = (props) => {
  const db = firebase.firestore();
  console.log(props.location.state);


  const history = useHistory();
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [video, setVideo] = useState(null);
  const [subcat, setPrice] = useState([]);

  const initialFormData = {
    fName:props.location.state.fName,
    lName:props.location.state.lName,
    dob:props.location.state.dob,
    email:props.location.state.email,
    userName:props.location.state.userName,
    mobileNo:props.location.state.mobileNo,
    password:props.location.state.password,
    baseSalary:props.location.state.baseSalary

  };
  const [type, setType] = useState(props.location.state.role);
  const formData = useFormik({
    initialValues: initialFormData,
  });
  const updatedType = async (s) => {
      console.log(s);
    setType(s);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    // var getYouTubeID = require("get-youtube-id");
    // const { image, description, link } = video;
    // video.videoId = getYouTubeID(link);
    // const imageType = image?.type;
    try {
        await firebase.firestore().collection("employee").doc(props.location.state.id).update({
            fName:formData.values.fName,
            lName:formData.values.lName,
            dob:formData.values.dob,
            email:formData.values.email,
            userName:formData.values.userName,
            mobileNo:formData.values.mobileNo,
            password:formData.values.password,
            baseSalary:formData.values.baseSalary,
            role:type
        });
        alert("Employee Updated");
      }catch (error) {
      }
      history.push("/blogs");
  };

  return (
    <CCard>
      <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >Update Employee</CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}  style={{alignItems: 'center'}}> 
        <CFormGroup>
                <CRow className="g-3 align-items-center">
                  <CCol md="2">
                    <CLabel>First Name</CLabel>
                  </CCol>
                  <CCol sm={4}>
                    <CInput
                      type="text"
                      placeholder="Enter First Name"
                      name="fName"
                      value={formData.values.fName}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}
                    />
                  </CCol>
                  <CCol md="2">
                    <CLabel>Last Name</CLabel>
                  </CCol>
                  <CCol sm={4}>
                    <CInput
                      type="text"
                      placeholder="Enter Last Name"
                      name="lName"
                      value={formData.values.lName}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}
                    />
                  </CCol>
                </CRow>
            </CFormGroup>
            <CFormGroup>
                <CRow className="g-3 align-items-center">
                  <CCol md="2">
                    <CLabel>DOB</CLabel>
                  </CCol>
                  <CCol sm={4}>
                    <CInput
                      type="text"
                      placeholder="Enter DOB"
                      name="dob"
                      value={formData.values.dob}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}
                    />
                  </CCol>
                  <CCol md="2">
                    <CLabel>MObile Number</CLabel>
                  </CCol>
                  <CCol sm={4}>
                    <CInput
                      type="number"
                      placeholder="Enter Mobile Number"
                      name="mobileNo"
                      value={formData.values.mobileNo}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}
                    />
                  </CCol>
                </CRow>
              </CFormGroup>
              <CFormGroup>
                <CRow className="g-3 align-items-center">
                  <CCol md="2">
                    <CLabel>Email Id</CLabel>
                  </CCol>
                  <CCol sm={4}>
                    <CInput
                      type="email"
                      placeholder="Enter Email Id"
                      name="email"
                      value={formData.values.email}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}
                    />
                  </CCol>
                  <CCol md="2">
                    <CLabel>Role</CLabel>
                  </CCol>
                  <CCol sm={4}>
                  <CDropdown className="mt-2">
                      <CDropdownToggle
                        style={{
                          border: "1px solid #d8dbe0",
                          borderRadius: "0.25rem",
                          width: "100%",
                          textAlign: "left"
                        }}
                        caret
                        varient={"outline"}
                      >
                        {type}
                      </CDropdownToggle>
                      <CDropdownMenu style={{ width: "100%",}}>
                        <CDropdownItem header>
                          Select Role
                        </CDropdownItem>
                        <CDropdownItem divider />
                        <CDropdownItem
                                  onClick={() => updatedType('Admin')}
                                >
                                  Admin
                                </CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>
                    </CCol>
                </CRow>
              </CFormGroup>
              <CFormGroup>
                <CRow className="g-3 align-items-center">
                  <CCol md="2">
                    <CLabel>userName</CLabel>
                  </CCol>
                  <CCol sm={4}>
                    <CInput
                      type="text"
                      placeholder="Enter userName"
                      name="userName"
                      value={formData.values.userName}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}
                    />
                  </CCol>
                  <CCol md="2">
                    <CLabel>Password</CLabel>
                  </CCol>
                  <CCol sm={4}>
                    <CInput
                      type="password"
                      placeholder="Enter Password"
                      name="password"
                      value={formData.values.password}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}
                    />
                  </CCol>
                </CRow>
              </CFormGroup>
              <CFormGroup>
                <CRow className="g-3 align-items-center">
                  <CCol md="2">
                    <CLabel>Base Salary</CLabel>
                  </CCol>
                  <CCol sm={4}>
                    <CInput
                      type="number"
                      placeholder="Enter Base Salary"
                      name="baseSalary"
                      value={formData.values.baseSalary}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}
                    />
                  </CCol>
                  <CCol md="2">
                    {/* <CLabel>Password</CLabel> */}
                  </CCol>
                  <CCol sm={4}>
                    
                  </CCol>
                </CRow>
              </CFormGroup>
          {showProgress && (
            <CProgress className="mb-3">
              <CProgressBar value={progress}>{progress}%</CProgressBar>
            </CProgress>
          )}

          <CFormGroup>
          <CCol md={12}style={{ display: "flex" }}>
            {submitLoading ? (
              <CSpinner size="small" color="info" />
            ) : (
              <CButton type="submit" style={{color: "#fff",backgroundColor: "#f8b11c",borderColor: "#f8b11c",marginLeft: "auto",marginRight:"auto",marginTop:"10px"}} disabled={submitLoading}>
                      Submit
                    </CButton>
            )}
            </CCol>
          </CFormGroup>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default EditEmployee;

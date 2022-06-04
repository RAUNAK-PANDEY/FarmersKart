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
  CDropdownItem,
  CDropdownMenu,
  CInputFile,
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { useHistory } from "react-router";
import { useFormik } from "formik";
import ImageCrop from './ImageCrop'

window.vname = 0;
  [window.setVideo] = [];
  export function image64f (image64) {
    // console.log(image64);
      window.setVideo=image64;
      window.vname=1;
  }

const AddBanner = () => {
  const db = firebase.firestore();

  const history = useHistory();
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [video, setVideo] = useState(null);
  const [subcat, setPrice] = useState([]);
  var [cat, setCat] = useState([]);
  const [status, setStatus] = useState({
    name: "",
    id: "",
  });

  useEffect(() => {
    getOrders();
   
  }, []);
  const getOrders = async () => {
    const response = await firebase.firestore().collection("categories");
    const data = await response.get();
    data.docs.forEach((item) => {
      cat.push({ id: item.id, ...item.data() });
    });
    setCat([...cat, cat]);
  };
  const initialFormData = {
    name: "",
    sequence:""
  };
  const formData = useFormik({
    initialValues: initialFormData,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    // var getYouTubeID = require("get-youtube-id");
    // const { image, description, link } = video;
    // video.videoId = getYouTubeID(link);
    // const imageType = image?.type;
    if (window.vname == 0) {
      alert("All fields are required!");
      setSubmitLoading(false);
      return;
    }else if(status.name === "Select Category"){
      e.preventDefault()
      alert("Please Select Category!")
      setSubmitLoading(false);
    }else {
      var storage = firebase.storage();
      var storageRef = storage.ref();
      var uploadTask = storageRef.child("bannerImages/" + Date.now()).put(window.setVideo);
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          console.log(snapshot);
          var progress =
            Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // setProgress(progress);
        },
        (error) => {
          console.log(error);
          alert(error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(async (url) => {
            try {
              await firebase.firestore().collection("generalData").doc("banners").collection("banners").add({
                name:formData.values.name,
                sequence:formData.values.sequence,
                imageUrl: url,
                category_id: status.id,
                categoryName: status.name,
                isActive:true
              });
            }catch (error) {
            }
            alert("Banner Added")
            setSubmitLoading(false);
            history.push("/banner");
          });
        }
      );
    }
  };
  const updatedStatus = async (s, i) => {
    setStatus({ name: s, id: i });
  };
  return (
    <CCard>
      <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >Add Banner</CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          <CFormGroup>
          <CRow className="g-3 align-items-center">
                <CCol md="6" sm="2">
                  <CLabel>Banner Name</CLabel>
                </CCol>
            <CCol sm={4}>
            <CInput
              type="text"
              placeholder="Enter Banner Name"
              name="name"
              value={formData.values.name}
              onChange={(e) => {
                formData.handleChange(e);
              }}
            />
            </CCol>
          </CRow>
          </CFormGroup>
          <CFormGroup>
          <CRow className="g-3 align-items-center">
                <CCol md="6" sm="2">
                  <CLabel>Sequence</CLabel>
                </CCol>
            <CCol sm={4}>
            <CInput
              type="number"
              placeholder="Enter Sequence"
              name="sequence"
              value={formData.values.sequence}
              onChange={(e) => {
                formData.handleChange(e);
              }}
            />
            </CCol>
          </CRow>
          </CFormGroup>
          <CFormGroup>
          <CRow className="g-3 align-items-center">
            <CCol md="6" sm="2">
                    <CLabel>Select Category</CLabel>
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
                        {status.name===""?"Select Category":status.name}
                      </CDropdownToggle>
                      <CDropdownMenu style={{ width: "100%",}}>
                        <CDropdownItem header>Select category</CDropdownItem>
                        <CDropdownItem divider />
                        <CDropdownItem onClick={() => updatedStatus("", "")}>None</CDropdownItem>
                        {cat &&
                          cat.map((cat, index) => {
                            return (
                              <CDropdownItem
                              required
                                onClick={() => updatedStatus(cat.name, cat.id)}
                              >
                                {cat.name}
                              </CDropdownItem>
                            );
                          })}
                      </CDropdownMenu>
                    </CDropdown>
                  </CCol>
          </CRow>
          </CFormGroup>
          <CFormGroup>
          <CRow className="g-3 align-items-center">
                <CCol md="6" sm="2">
                  <CLabel>Upload Image </CLabel>
                </CCol>
            <CCol sm={4}>
              <ImageCrop/>
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

export default AddBanner;

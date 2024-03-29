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
  CImg,
  CInputFile,
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { useHistory } from "react-router";
import { useFormik } from "formik";
import ImageCrop from './ImageCrop'
import ImageCrop2 from './ImageCrop2'
import ImageCrop3 from './ImageCrop3'

  window.vname = 0;
  // window.pImage = 0;
  [window.setVideo] = [];
  export function image64ep (image64) {
    // console.log(image64);
      window.setVideo=image64;
      // window.pImage = 1;
      window.vname=1;
  }
  window.vname = 0;
  // window.fImage = 0;
  [window.setImage] = [];
  export function image64fp (image64) {
    // console.log(image64);
      window.setImage=image64;
      // window.fImage = 1;
      window.vname=1;
  }
  window.vname = 0;
  // window.sImage = 0;
  [window.setPage] = [];
  export function image64sp (image64) {
    // console.log(image64);
      window.setPage=image64;
      // window.sImage = 1;
      window.vname=1;
  }


const EditPopup = (props) => {
  const db = firebase.firestore();

  // console.log(props.location.index);
  const history = useHistory();
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [video, setVideo] = useState(null);
  const [subcat, setPrice] = useState([]);

  const initialFormData = {
    homePageMessage: props.location.state.homePageMessage,
    dealsPageMessage:props.location.state.dealsPageMessage,
    cartMessage:props.location.state.cartMessage
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
        try {
            await firebase.firestore().collection("generalData").doc("appData").update({
              homePageMessage:formData.values.homePageMessage,
              dealsPageMessage:formData.values.dealsPageMessage,
              cartMessage:formData.values.cartMessage,
              isActive:true
            });
          }catch (error) {
          }
          alert("Popup Updated")
          setSubmitLoading(false);
          history.push("/banner/popups");
    } else if(props.location.index == 1){
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
              await firebase.firestore().collection("generalData").doc("appData").update({
                homePageMessage:formData.values.homePageMessage,
                dealsPageMessage:formData.values.dealsPageMessage,
                cartMessage:formData.values.cartMessage,
                offerPopup: [url],
                isActive:true
              });
            }catch (error) {
            }
            alert("Popup Updated")
            setSubmitLoading(false);
            history.push("/banner/popups");
          });
        }
      );
    }else if(props.location.index == 2){
      var storage = firebase.storage();
      var storageRef = storage.ref();
      var uploadTask = storageRef.child("bannerImages/" + Date.now()).put(window.setImage);
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
              await firebase.firestore().collection("generalData").doc("appData").update({
                homePageMessage:formData.values.homePageMessage,
                dealsPageMessage:formData.values.dealsPageMessage,
                cartMessage:formData.values.cartMessage,
                page1ImageUrl: url,
                isActive:true
              });
            }catch (error) {
            }
            alert("Popup Updated")
            setSubmitLoading(false);
            history.push("/banner/popups");
          });
        }
      );
    }else if(props.location.index == 3){
      var storage = firebase.storage();
      var storageRef = storage.ref();
      var uploadTask = storageRef.child("bannerImages/" + Date.now()).put(window.setPage);
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
              await firebase.firestore().collection("generalData").doc("appData").update({
                homePageMessage:formData.values.homePageMessage,
                dealsPageMessage:formData.values.dealsPageMessage,
                cartMessage:formData.values.cartMessage,
                page2ImageUrl: url,
                isActive:true
              });
            }catch (error) {
            }
            alert("Popup Updated")
            setSubmitLoading(false);
            history.push("/banner/popups");
          });
        }
      );
    }
  };

  return (
    <CCard>
      <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >Edit Popup</CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}>
        <CFormGroup>
          <CRow className="g-3 align-items-center">
                <CCol md="6" sm="2">
                  <CLabel>Cart Message</CLabel>
                </CCol>
            <CCol sm={4}>
            <CInput
              type="text"
              placeholder="Enter Cart Message"
              name="cartMessage"
              value={formData.values.cartMessage}
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
                  <CLabel>Deal Page Message</CLabel>
                </CCol>
            <CCol sm={4}>
            <CInput
              type="text"
              placeholder="Enter Deal Page Message"
              name="dealsPageMessage"
              value={formData.values.dealsPageMessage}
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
                  <CLabel>Home Page Message</CLabel>
                </CCol>
            <CCol sm={4}>
            <CInput
              type="text"
              placeholder="Enter Home Page Message"
              name="homePageMessage"
              value={formData.values.homePageMessage}
              onChange={(e) => {
                formData.handleChange(e);
              }}
            />
            </CCol>
          </CRow>
          </CFormGroup>
          {
            props.location.index == 1? 
                <CFormGroup>
                  <CRow className="g-3 align-items-center">
                        <CCol md="6" sm="2">
                          <CLabel>Upload PopUp Image </CLabel>
                        </CCol>
                    <CCol sm={4}>
                        <ImageCrop/>
                    </CCol>
                  </CRow>
                </CFormGroup>
            :props.location.index == 2?
                <CFormGroup>
                  <CRow className="g-3 align-items-center">
                        <CCol md="6" sm="2">
                          <CLabel>Upload Page 1 Image </CLabel>
                        </CCol>
                    <CCol sm={4}>
                        <ImageCrop2/>
                    </CCol>
                  </CRow>
                </CFormGroup>
            :props.location.index == 3?
                <CFormGroup>
                  <CRow className="g-3 align-items-center">
                        <CCol md="6" sm="2">
                          <CLabel>Upload Page 2 Image </CLabel>
                        </CCol>
                    <CCol sm={4}>
                        <ImageCrop3/>
                    </CCol>
                  </CRow>
                </CFormGroup>
            :<div></div>
          }
          {
            props.location.index == 1? 
                <CFormGroup>
                  <CRow className="g-3 align-items-center">
                    <CCol md="6">
                      <CLabel> </CLabel>
                    </CCol>
                    <CCol sm={3}>
                      { (video===null)?
                        <CImg
                            rounded="true"
                            src={props.location.state.offerPopup}
                            width={200}
                            height={100}
                        />:<div></div>
                      }
                    </CCol>
                  </CRow>
                </CFormGroup>
            :props.location.index == 2?
                <CFormGroup>
                  <CRow className="g-3 align-items-center">
                    <CCol md="6">
                      <CLabel> </CLabel>
                    </CCol>
                    <CCol sm={3}>
                      { (video===null)?
                        <CImg
                            rounded="true"
                            src={props.location.state.page1ImageUrl}
                            width={200}
                            height={100}
                        />:<div></div>
                      }
                    </CCol>
                  </CRow>
              </CFormGroup>
            :props.location.index == 3?
              <CFormGroup>
                <CRow className="g-3 align-items-center">
                  <CCol md="6">
                    <CLabel> </CLabel>
                  </CCol>
                  <CCol sm={3}>
                    { (video===null)?
                      <CImg
                          rounded="true"
                          src={props.location.state.page2ImageUrl}
                          width={200}
                          height={100}
                      />:<div></div>
                    }
                  </CCol>
                </CRow>
                </CFormGroup>
            :<div></div>
          }
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

export default EditPopup;

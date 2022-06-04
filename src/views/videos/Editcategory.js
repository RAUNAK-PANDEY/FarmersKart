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
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import {base64StringtoFile,
  downloadBase64File,
  extractImageFileExtensionFromBase64,
  image64toCanvasRef} from '../../views/services/ReusableUtils'
  import '../../views/services/custom-image-crop.css';
  import ImageCrop from './ImageCrop'

  window.name = 0;
  [window.setVideo] = [];
  export function image64f (image64) {
    // console.log(image64);
      window.setVideo=image64;
      window.name=1;
  }

  const Editcategory = (props) => {
  const db = firebase.firestore();

  const history = useHistory();
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [video, setVideo] = useState([]);
  const [result, setResult] = useState([]);
  const [urls, setUrls] = useState([]);
  const [photoURL, setPhotoURL] = useState("");
  const [image ,setImage]= useState({
    imgSrc: null,
    imgSrcExt: null,
  })
  var [state, setState] = useState({
    verified_service_providers: null,
    unverified_service_providers: null,
    crop: {
      unit: '%',
      aspect: 1/1
    }
  });

  const initialFormData = {
    name: props.location.state.name,
    subCategory:props.location.state.subCategory,
    priority:props.location.state.priority
  };
  const formData = useFormik({
    initialValues: initialFormData,
  });

  const handleChange = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[i];
      newImage["id"] = Math.random();
      setVideo((prevState) => [...prevState, newImage]);
      // console.log(newImage);
      setPhotoURL(URL.createObjectURL(newImage));
      // console.log(photoURL);
      // const currentFile = files[0]
      const myFileItemReader = new FileReader()
      myFileItemReader.addEventListener("load", ()=>{
          // console.log(myFileItemReader.result)
          const myResult = myFileItemReader.result
          setImage({
              imgSrc: myResult,
              imgSrcExt: extractImageFileExtensionFromBase64(myResult)
          })
      }, false)

      myFileItemReader.readAsDataURL(newImage)
    }      
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    // var getYouTubeID = require("get-youtube-id");
    // const { image, description, link } = video;
    // video.videoId = getYouTubeID(link);
    // const imageType = image?.type;
    if (window.name == 0) {
      try {
          await firebase.firestore().collection("categories").doc(props.location.state.id).update({
            name:formData.values.name,
            subCategory:formData.values.subCategory,
            imageUrl: props.location.state.imageUrl,
            priority:formData.values.priority
          });
          await firebase.firestore().collection("products").where("category","==",props.location.state.id).update({
            categoryName:formData.values.name,
          });
        }catch (error) {
        }
        history.push("/videos");
    } else {
      var storage = firebase.storage();
      var storageRef = storage.ref();
      var uploadTask = storageRef.child("categoriesImages/" + Date.now()).put(window.setVideo);
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
              await firebase.firestore().collection("categories").doc(props.location.state.id).update({
                name:formData.values.name,
                subCategory:formData.values.subCategory,
                imageUrl: url,
                priority:formData.values.priority
              });
              await firebase.firestore().collection("products").where("category","==",props.location.state.id).update({
                categoryName:formData.values.name,
              });
            }catch (error) {
            }
            history.push("/videos");
          });
        }
      );
    }
  };

  return (
    <CCard>
      <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >Update Category</CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}  style={{alignItems: 'center'}}> 
          <CFormGroup>
          <CRow className="g-3 align-items-center">
                <CCol md="6" sm="2">
                  <CLabel>Name </CLabel>
                </CCol>
            <CCol sm={4}>
            <CInput
              type="text"
              placeholder="Enter Category"
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
                <CCol md="6" sm="2" style={{textAlign: "end"}}>
                  <CLabel>Priority No.</CLabel>
                </CCol>
            <CCol sm={4}>
              <CInput
                type="text"
                placeholder="Enter Category Priority no."
                name="priority"
                value={formData.values.priority}
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
                  <CLabel>Upload Image </CLabel>
                </CCol>
            <CCol sm={4}>
                <ImageCrop/>
            </CCol>
              </CRow>
          </CFormGroup>
          <CFormGroup>
              <CRow className="g-3 align-items-center">
                <CCol md="2">
                  <CLabel> </CLabel>
                </CCol>
                <CCol sm={4}>
                </CCol>
                <CCol md="2">
                  <CLabel></CLabel>
                </CCol>
                <CCol sm={3}>
                    <CImg
                        rounded="true"
                        src={props.location.state.imageUrl}
                        width={200}
                        height={100}
                    />
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
                      Update
                    </CButton>
            )}
            </CCol>
          </CFormGroup>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default Editcategory;

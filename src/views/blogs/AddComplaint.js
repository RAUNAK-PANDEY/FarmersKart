import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import {
  CBadge,
  CImg,
  CInputGroup,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardText,
  CCardImg,
  CCardTitle,
  CLabel,
  CCol,
  CForm,
  CFormGroup,
  CRow,
  CInput,
  CSpinner,
  CDropdown,
  CDropdownToggle,
  CDropdownItem,
  CDropdownMenu,
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { useFormik } from "formik";
import ImageCrop from './ImageCrop'

window.vname = 0;
[window.setVideo] = [];
export function image64av (image64) {
  // console.log(image64);
    window.setVideo=image64;
    window.vname=1;
}
const AddComplaint = () => {

    // console.log(props.location.state);
  const history = useHistory();
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  var [cat, setCat] = useState([]);
  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
//   const [lastOrder, setLastOrder] = useState("");
  // const [details, setDetails] = useState([]);
  const [refresh, setRefresh] = React.useState(false);
  var [state, setState] = useState({
    videos: null,
  });
  const initialFormData = {
    name:"",
    subject:"",
    complaint:""
  };
  const formData = useFormik({
    initialValues: initialFormData,
  });

  useEffect(() => {
    getVideos();
  }, [refresh]);

  const getVideos = async () => {
    setLoading(true);
    const videos = await firebase.firestore().collection("complaints").get();
    // setLastOrder(videos.docs[videos.docs.length - 1]);
    // setLastOrder([videos.docs.length-1]);
    // console.log(videos.docs.length);
    // console.log(lastOrder);

    let resolvedVideos = videos.docs.map((video) => {
      const id = video.id;
      const videoData = video.data();

      return {
        ...videoData,
        id: id,
        complaint:videoData.complaint,
        date:new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(videoData.date),
        timedate:videoData.date,
        // date:videoData.date,
        imageUrl:videoData.imageUrl,
        name:videoData.name,
        subject:videoData.subject,
        userId:videoData.userId,
        status:videoData.status,
        ddate:new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(videoData.procesDate),
        pdate:videoData.procesDate,
        sdate:new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(videoData.solvedDate),
        solveddate:videoData.solvedDate,
        // solvedDate:,
        adminComment:videoData.adminComment,

      };
    });

    // resolvedVideos = resolvedVideos.sort(compare);
    // console.log(resolvedVideos);

    setState({
      ...state,
      videos: resolvedVideos,
    });
    setLoading(false);
    // console.log(videos);
  };
  const [type, setType] = useState("");
  const [para, setPara] = useState("");
  const [status, setStatus] = useState({
      id:"",
      name:"",
      email:"",
      mobile:"",
      societyName:""
  });
  var [gdata, setData] = useState([]);

  const updatedPara = async (s) => {
    setPara(s)
    // getUsers();
  };
  const updatedType = async (s) => {
    setType(s)
    // setData([]);
    // getUsers();
  };
  const updatedStatus = async (cid,cname,cnumber,cemail,csocietyName) => {
    setStatus({id:cid,name:cname,mobile:cnumber,email:cemail,societyName:csocietyName})
    console.log(status);
  };

  const getUsers = async () => {
    if (para ==="name") {
      const users = await firebase.firestore().collection("users").where("userType","==",type).where("name","==",formData.values.name).get();
      // setLorder(users.docs.length);
  
      const resolvedUsers = users.docs.map((user) => {
        const id = user.id;
        const userData = user.data();
  
        return {
          ...userData,
          id: id,
          customerName: userData.name,
          customerNumber:userData.mobile,
          customerToken:userData.firebaseToken,
          societyName: userData.societyName,
          userType:userData.userType,
          address:userData.address,
          centerId:userData.centerId,
          customerEmail:userData.email,
          wing:userData.wing,
          flatNo:userData.flatNo
        };
      });
      // Object.assign(gdata=resolvedUsers)
      setData(resolvedUsers);
      setRefresh(!refresh);
        
    }else if (para ==="email") {
      const users = await firebase.firestore().collection("users").where("userType","==",type).where("email","==",formData.values.name).get();
      // setLorder(users.docs.length);
  
      const resolvedUsers = users.docs.map((user) => {
        const id = user.id;
        const userData = user.data();
  
        return {
          ...userData,
          id: id,
          customerName: userData.name,
          customerNumber:userData.mobile,
          customerToken:userData.firebaseToken,
          societyName: userData.societyName,
          userType:userData.userType,
          address:userData.address,
          centerId:userData.centerId,
          customerEmail:userData.email,
          wing:userData.wing,
          flatNo:userData.flatNo
        };
      });
      // Object.assign(gdata=resolvedUsers)
      setData(resolvedUsers);
      setRefresh(!refresh);
        
    }else if (para ==="mobile") {
      const users = await firebase.firestore().collection("users").where("userType","==",type).where("mobile","==",formData.values.name).get();
      // setLorder(users.docs.length);
  
      const resolvedUsers = users.docs.map((user) => {
        const id = user.id;
        const userData = user.data();
  
        return {
          ...userData,
          id: id,
          customerName: userData.name,
          customerNumber:userData.mobile,
          customerToken:userData.firebaseToken,
          societyName: userData.societyName,
          userType:userData.userType,
          address:userData.address,
          centerId:userData.centerId,
          customerEmail:userData.email,
          wing:userData.wing,
          flatNo:userData.flatNo
        };
      });
      // Object.assign(gdata=resolvedUsers)
      setData(resolvedUsers);
      setRefresh(!refresh);
        
    }
};
const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    // var getYouTubeID = require("get-youtube-id");
    // const { image, description, link } = video;
    // video.videoId = getYouTubeID(link);
    // const imageType = image?.type;
    if (window.vname == 0) {
        try {
            await firebase.firestore().collection("complaints").add({
                userId:status.id,
                customerName:status.name,
                customerEmail:status.email,
                customerNumber:status.mobile,
                societyName:status.societyName,
                complaint:formData.values.complaint,
                subject:formData.values.subject,
                date:Date.now(),
                status:"New",
                imageUrl:"",
                isActive:true,
            });
            alert("Complaint Registered Successfully");
          }catch (error) {
          }
          history.push("/blogs/user-complaint");
    }else {
      var storage = firebase.storage();
      var storageRef = storage.ref();
      var uploadTask = storageRef.child("complaintImages/" + Date.now()).put(window.setVideo);
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
                await firebase.firestore().collection("complaints").add({
                    userId:status.id,
                    customerName:status.name,
                    customerEmail:status.email,
                    customerNumber:status.mobile,
                    societyName:status.societyName,
                    complaint:formData.values.complaint,
                    subject:formData.values.subject,
                    date:Date.now(),
                    isActive:true,
                    status:"New",
                    imageUrl:url,
                });
                alert("Complaint Registered Successfully");
              }catch (error) {
              }
              history.push("/blogs/user-complaint");
          });
        }
      );
    }
  };

  return (
    <CRow>
        {/* <CCard className="mb-3" style={{ maxWidth: '540px',marginLeft:"18px" }}>
            <CRow className="g-0">
            <CCol md={4}>
                <CCardImg src={"avatars/profile.jpg"} />
            </CCol>
            <CCol md={8}>
                <CCardBody>
                    <CCardTitle>User Profile</CCardTitle>
                    <CCardText>
                        Name: {props.location.state.name}
                    </CCardText>
                    {props.location.state.mobile==""?<CCardText></CCardText>:<CCardText>
                        Phone No.: {props.location.state.mobile}
                    </CCardText>}
                    {props.location.state.email==""?<CCardText></CCardText>:<CCardText>
                        Email Id: {props.location.state.email}
                    </CCardText>}
                    <CCardText>
                        Wing & Flat No: {props.location.state.wing+"/"+props.location.state.fno} 
                    </CCardText>
                    <CCardText>
                        Society Name: {props.location.state.soc}
                    </CCardText>
                    {/* <CCardText>
                        <small className="text-medium-emphasis">Last updated 3 mins ago</small>
                    </CCardText> */}
                {/* </CCardBody>
                </CCol>
            </CRow>
        </CCard>  */}
      {/* <CCol xl={1} /> */}
      <CCol lg={12}>
        <CCard>
        <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >Add User Complaint</CCardHeader>
          <CCardBody>
          <CForm onSubmit={handleSubmit}  style={{alignItems: 'center'}}> 
        <CFormGroup>
              <CCol>
              <CCard>
            <CCardBody>
              <CRow>
              <CCol md="3"><CLabel>Select User Type </CLabel></CCol>
                  <CCol md="9">
              <CDropdown className="mt-2" style={{ border: "1px solid #d8dbe0", borderRadius:"0.25rem" }}>
                                  <CDropdownToggle
                                    caret
                                    varient={"outline"}
                                  >
                                    {type===""?"Select User Type":type}
                                  </CDropdownToggle>
                                  <CDropdownMenu style={{ width: "100%"}}>
                                    <CDropdownItem header>Select User type</CDropdownItem>
                                    <CDropdownItem divider />
                                    <CDropdownItem onClick={() =>updatedType("Society")}>Society</CDropdownItem>
                                    <CDropdownItem onClick={() =>updatedType("Shop")}>Shop</CDropdownItem>
                                    <CDropdownItem onClick={() =>updatedType("Hotel")}>Hotel</CDropdownItem>
                                  </CDropdownMenu>
                        </CDropdown>
                        </CCol>
                    </CRow>
                    <CRow>
              {/* <b>{cat.imageUrl =="" && cat.orderList}</b> */}
              <CCol md="3"><CLabel>Select Parameter </CLabel></CCol>
                  <CCol md="9">
              <CDropdown className="mt-2" style={{ border: "1px solid #d8dbe0", borderRadius:"0.25rem" }}>
                                  <CDropdownToggle
                                    caret
                                    varient={"outline"}
                                  >
                                    {para===""?"Select Parameter":para}
                                  </CDropdownToggle>
                                  <CDropdownMenu style={{ width: "100%"}}>
                                    <CDropdownItem header>Select User type</CDropdownItem>
                                    <CDropdownItem divider />
                                    <CDropdownItem onClick={() =>updatedPara("name")}>Name</CDropdownItem>
                                    <CDropdownItem onClick={() =>updatedPara("email")}>Email</CDropdownItem>
                                    <CDropdownItem onClick={() =>updatedPara("mobile")}>Mobile No</CDropdownItem>
                                  </CDropdownMenu>
                        </CDropdown>
                        </CCol>
                    </CRow>
                    <CRow style={{marginTop:"5px"}}>
                    <CCol md="3">
                            <CLabel>Enter User Details</CLabel>
                        </CCol>
                        <CCol md={6}>
                            <CInput
                            required 
                            type="text"
                            placeholder="Name"
                            name="name"
                            value={formData.values.name}
                            onChange={(e) => {
                                formData.handleChange(e);
                                // setFormData({
                                //   ...formData.values,
                                //   name: e.target.value
                                // })
                            }}
                            />
                        </CCol>
                        <CCol md="3">
                        <CButton
                                  style={{
                                    color: "#fff",
                                    backgroundColor: "#f8b11c",
                                    borderColor: "#f8b11c",
                                    borderRadius: "0.25rem",
                                    marginRight: "5px",
                                    
                                  }}
                                  type="button"
                                  color="secondary"
                                  variant="outline"
                                  onClick={() => getUsers()}
                                >
                                  Search
                                </CButton>

                        </CCol>
                    </CRow>
                    <CRow>
                <CCol md="3"><CLabel>Select User</CLabel></CCol>
                  <CCol md="9">
                        <CDropdown className="mt-2" style={{ border: "1px solid #d8dbe0", borderRadius:"0.25rem" }}>
                                  <CDropdownToggle
                                    caret
                                    varient={"outline"}
                                  >
                                    {status.mobile===""?"Select User":status.mobile}
                                  </CDropdownToggle>
                                  <CDropdownMenu style={{ width: "100%"}}>
                                    <CDropdownItem header>Select User</CDropdownItem>
                                    <CDropdownItem divider />
                                    {
                                        gdata && gdata.map((cat,index)=>{
                                            return(
                                            <CDropdownItem onClick={() => updatedStatus(cat.id,cat.customerName,cat.customerNumber,cat.customerEmail,cat.societyName)}><div><div>{cat.customerName}</div><div>{cat.mobile}</div></div></CDropdownItem>
                                            )
                                        })
                                    }
                                  </CDropdownMenu>
                        </CDropdown>
                        </CCol>
                    </CRow>
                    <CRow style={{marginTop:"5px"}}>
                    <CCol md="3">
                            <CLabel>Enter Subject</CLabel>
                        </CCol>
                        <CCol md={6}>
                            <CInput
                            required 
                            type="text"
                            placeholder="Enter Subject"
                            name="subject"
                            value={formData.values.subject}
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

                    <CRow style={{marginTop:"5px"}}>
                    <CCol md="3">
                            <CLabel>Enter User Complaint</CLabel>
                        </CCol>
                        <CCol md={6}>
                            <CInput
                            required 
                            type="text"
                            placeholder="Enter User Complaint"
                            name="complaint"
                            value={formData.values.complaint}
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
                    <CRow style={{marginTop:"5px"}}>
                    <   CCol md="3">
                            <CLabel>Complaint Images</CLabel>
                        </CCol>
                        <CCol md={6}>
                            <ImageCrop/>
                        </CCol>
                    </CRow>

            </CCardBody>
          </CCard>
              </CCol>
            </CFormGroup>
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
      </CCol>

      {/* <CCol xl={1} /> */}
    </CRow>
  );
};

export default AddComplaint;

import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardText,
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
  CDropdownItem,
  CDropdownDivider,
  CInputGroup
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { useHistory } from "react-router";
import { useFormik } from "formik";

const EditCoupon = (props) => {
  console.log(props.location.state);
  const db = firebase.firestore();


  const history = useHistory();
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [video, setVideo] = useState(null);
  const [cat, setCat] = useState([]);
  var [state, setState] = useState({
    videos: null,
  });

  const initialFormData = {
    coupons:props.location.state.name,
    couponAmount:props.location.state.discount,
    couponExpiryDate:props.location.state.validity,
    miniumOrderAmount:props.location.state.minOrder,
    couponMessage:props.location.state.description

  };

  useEffect(() => {
    getVideos();
  }, []);

  const getVideos = async () => {
    // setLoading(true);
    // const response=await firebase.firestore().collection("centers").get();
    // response.data().doc.map(sub1 =>{
    //     return(cat.push(sub1))
    //   })
    // setCat([...cat,cat])
    // console.log(cat.length);
    // setLoading(false);
    const response = await firebase.firestore().collection("centers");
    const data = await response.get();
    data.docs.forEach((item) => {
      cat.push({ docId: item.id, ...item.data() });
    });
    setCat([...cat, cat]);
  };
  

  const [type, setType] = useState(props.location.state.discountType);
  const formData = useFormik({
    initialValues: initialFormData,
  });
  const [status, setStatus] = useState({
    name: props.location.state.societyName,
    id: props.location.state.centerId,
  });
  const updatedType = async (s) => {
    setType(s);
  };
  const updatedStatus = async (s, i) => {
    setStatus({ name: s, id: i });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true)
    // console.log();
    try {
        await firebase.firestore().collection("coupons").doc(props.location.state.id).update({
            code:formData.values.coupons,
            discount:formData.values.couponAmount,
            type:type,
            // validity:new Date(document.getElementById("date-input").value).getTime(),
            minOrder:formData.values.miniumOrderAmount,
            isActive:true,
            // quantity:1,
            description:formData.values.couponMessage,
            // maxBenefit:120,
            centerId:status.id,
            societyName:status.name
        });
        alert("Coupon Updated");
      }catch (error) {
      }
      history.push("/coupon");
    setSubmitLoading(false)

  };

  return (
    <CCard>
      <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >Add Coupons</CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}  style={{alignItems: 'center'}}> 
        <CFormGroup>
                <CRow className="g-3 align-items-center">
                  <CCol md="2">
                    <CLabel>Coupon Name</CLabel>
                  </CCol>
                  <CCol sm={4}>
                    <CInput
                      type="text"
                      placeholder="Enter Coupon"
                      name="coupons"
                      value={formData.values.coupons}
                      onChange={(e) => {
                        formData.handleChange(e);
                        
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}
                      // onBlur={() => generateCoupon()}
                    />
                  </CCol>
                  <CCol md="2">
                    <CLabel>Coupon Amount</CLabel>
                  </CCol>
                  <CCol sm={4}>
                  <CInputGroup className="mb-3">
                        <CDropdown variant="input-group" style={{color:"#333"}}>
                            <CDropdownToggle color="secondary" variant="outline">
                                {type}
                                </CDropdownToggle>
                            <CDropdownMenu>
                            <CDropdownItem header>Select Coupon Type</CDropdownItem>
                            <CDropdownDivider/>
                            <CDropdownItem onClick={() =>updatedType("Flat")}>Flat</CDropdownItem>
                            <CDropdownItem onClick={() =>updatedType("Percentage")}>Percentage</CDropdownItem>
                            </CDropdownMenu>
                        </CDropdown>
                            <CInput
                                type="number"
                                placeholder="Enter Coupon Amount"
                                name="couponAmount"
                                value={formData.values.couponAmount}
                                onChange={(e) => {
                                    formData.handleChange(e);
                                    // setFormData({
                                    //   ...formData.values,
                                    //   name: e.target.value
                                    // })
                                }}
                                
                            />
                    </CInputGroup>
                  </CCol>
                </CRow>
            </CFormGroup>
              <CFormGroup>
                <CRow className="g-3 align-items-center">
                  {/* <CCol md="2">
                    <CLabel>Coupon Expiry Date</CLabel>
                  </CCol>
                  <CCol sm={4}>
                  <CInput type="date" id="date-input" name="date-input" placeholder="date" />
                  </CCol> */}
                  <CCol md="2">
                    <CLabel>Minimum Order Amount</CLabel>
                  </CCol>
                  <CCol sm={4}>
                  <CInput
                      type="number"
                      placeholder="Minimum Order Amount"
                      name="miniumOrderAmount"
                      value={formData.values.miniumOrderAmount}
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
                    <CLabel>Coupon Message</CLabel>
                  </CCol>
                  <CCol sm={4}>
                    <CInput
                        type="text"
                        placeholder="Enter Coupon Message"
                        name="couponMessage"
                        value={formData.values.couponMessage}
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
                  <CLabel htmlFor="inputEmail4">Society Name</CLabel>
                  </CCol>
                  <CCol md={4} sm="6">
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
                        {status.name ===""?"Select Society Name":status.name}
                      </CDropdownToggle>
                      <CDropdownMenu style={{ width: "100%",}}>
                        <CDropdownItem header>Select center</CDropdownItem>
                        <CDropdownItem divider />
                        <CDropdownItem onClick={() => updatedStatus("All", "All")}>All</CDropdownItem>
                        {
                          cat.map((cat, index) => {
                            return (
                              <CDropdownItem
                              required
                                onClick={() => updatedStatus(cat.centerName, cat.id)}
                              >
                                {cat.centerName}
                              </CDropdownItem>
                            );
                          })}
                      </CDropdownMenu>
                    </CDropdown>
                     {/* <CInput
                      required 
                      type="text"
                      placeholder="Society Name"
                      name="societyName"
                      value={formData.values.societyName}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}
                    /> */}
                </CCol> 
                </CRow>
              </CFormGroup>
              <CFormGroup>
                    <CCardText type="text"  readOnly>
                        {/* {cat.map(sub=>{return(<div style={{color:"#333"}} >{sub}</div>)})} */}
                    </CCardText>
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

export default EditCoupon;

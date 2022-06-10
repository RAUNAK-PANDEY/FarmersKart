import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  CAlert,
  CInput,
  CForm,
  CFormGroup,
  CLabel,
  CSpinner,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CDropdown,
  CDropdownToggle,
  CDropdownItem,
  CDropdownMenu,
  CInputFile,
  CTextarea,
  CInputGroup,
  CImg
} from "@coreui/react";
import firebase from "../../config/fbconfig";
 import { useFormik } from "formik";
 
  

 
const EditCoupon = (props) => {
    var[porder, setPorder] = useState();

    const [submitLoading, setSubmitLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            await firebase.firestore().collection("coupons").doc(props.location.state.id).update({
            validity: porder,
            })
        }catch (error) {
        }

        console.log('hello')
        setSubmitLoading(false);
    }
    const onChangeDate =  (e) => {
        // var myDate1 = Date.parse(document.getElementById("date-to").value.split('-').reverse().join('-')); 
        
        // console.log(myDate1)
         
        porder=new Date(document.getElementById("date-to").value).getTime();
         console.log(porder)
         
      };
   return (
    <CRow style={{backgroundColor:"#f1f2f7"}}>
    <CCol xl={12}>
      <CCard>
        <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >Edit Coupon</CCardHeader>
        <CCardBody>
        <CForm onSubmit={handleSubmit} id="form">
          <CFormGroup>
            <CRow className="g-3 align-items-center">
              <CCol md="2">
                <CLabel>Date </CLabel>
              </CCol>
              <CCol sm={4}>
              <CInput type="date" id="date-to" name="date-input" placeholder="date" onChange={() => onChangeDate()}/>
              </CCol>
              </CRow>
              
              </CFormGroup>
              <CFormGroup>
                <CCol md={12} style={{ display: "flex" }}>
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
</CCol>
</CRow>
  );
};

export default EditCoupon;

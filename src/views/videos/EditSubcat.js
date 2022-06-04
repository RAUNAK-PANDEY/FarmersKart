import React, { useState, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
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
  CInputGroup,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { useHistory } from "react-router";
import { useFormik } from "formik";

const EditSubcat = (props) => {
  const db = firebase.firestore();
//   console.log(props.location.state);

  const history = useHistory();
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [video, setVideo] = useState(null);
  var [cat, setCat] = useState([]);
  const [subcat, setSub] = useState([]);

  useEffect(() => {
    getOrders();
  }, []);

  const PriceData = [...props.location.state.subCategory]

  const [status, setStatus] = useState({
    name: props.location.state.name,
    id:props.location.state.id,
  });
  const [socPrice, setPrice] = useState(PriceData);
  const updatedStatus = async (s,i) => {
    setStatus({name:s,id:i})
    // console.log(status.name);
  
  };
  const addPrice = () => {
    setPrice([...socPrice, PriceData]);
  };
  const Change = (e, index) =>{
    const updateddata = socPrice.map((socPrice,i) => index == i ?
    Object.assign(e.target.value) : socPrice );
    setPrice(updateddata);
    console.log(socPrice);
  };
  const remove = (index) => {
    const filterdata = [...socPrice];
    filterdata.splice(index,1);
    setPrice(filterdata);
  };

  
  const getOrders = async () => {
    const response=await firebase.firestore().collection("categories");
    const data=await response.get();
    data.docs.forEach(item=>{
      cat.push({id:item.id,...item.data()});
    })
    setCat([...cat,cat])
  };

  // const Change = (index) =>{
  //   const updateddata = socPrice.map((socPrice,i) => index == i ?
  //   Object.assign(socPrice,{[index]: "cancelled"}) : socPrice );
  //   setPrice(updateddata);
  //   Comment(index);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setSubmitLoading(true);
    // console.log(socPrice);
    socPrice.forEach((item,index)=>{
        console.log(item.index);
    })
    console.log(socPrice);
    try {
        await firebase.firestore().collection("categories").doc(status.id).update({
            subCategory : firebase.firestore.FieldValue.arrayUnion(socPrice)  
        });
        alert("Subcategory Updated");
      }catch (error) {
      }
      history.push("/videos/sub-category");
  };
  const deleteVideo = (rowId) => {
    // console.log(status.id);
    // console.log(rowId);
  confirmAlert({
    title: "Delete",
    message: "Are you sure to Delete ?",
    buttons: [
      {
        label: "Yes",
        onClick: async() => {
          await firebase.firestore().collection("categories").doc(props.location.state.id).update({
            subCategory : firebase.firestore.FieldValue.arrayRemove(rowId)
        })
        await firebase.firestore().collection("products").where("subCategory","==",rowId).update({
          subCategory:"",
        });
          // await firebase.firestore().collection("categories").doc(props.location.state.id).update({
          //     subCategory: firebase.firestore.FieldValue.arrayRemove(rowId)
          // })
          // setRefresh(!refresh);
              alert("Sub Category Deleted");
              history.push("/videos/sub-category");
        },
      },
      {
        label: "No",
        // onClick: () => alert("Close"),
      },
    ],
    // childrenElement: () => <div />,
    // customUI: ({ onClose }) => <div>Custom UI</div>,
    closeOnEscape: true,
    closeOnClickOutside: true,
    willUnmount: () => {},
    afterClose: () => {},
    onClickOutside: () => {},
    onKeypressEscape: () => {},
    // overlayClassName: "overlay-custom-class-name"
  });

};

  const style = {
    // Adding media querry..
    '@media (min-width: 500px)': {
        textAlign: 'end',
    },
    };

  return (
    <CCard>
      <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >Update Sub Category</CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          <CFormGroup>
          <CRow className="g-3 align-items-center">
          <CCol md="6" sm="2">
                  <CLabel style={style}>Select Category</CLabel>
                </CCol>
                <CCol sm={4}>
                  <CDropdown className="mt-2">
                              <CDropdownToggle
                                style={{ border: "1px solid #d8dbe0", borderRadius:"0.25rem" }}
                                caret
                                varient={"outline"}
                              >
                                {status.name}
                              </CDropdownToggle>
                              <CDropdownMenu>
                                <CDropdownItem header>Select category</CDropdownItem>
                                <CDropdownItem divider />
                                {
                                  cat && cat.map((cat,index)=>{
                                    return(
                                      <CDropdownItem onClick={() => updatedStatus(cat.name,cat.id)}>{cat.name}</CDropdownItem>
                                    )
                                  })
                                }
                              </CDropdownMenu>
                    </CDropdown>
                </CCol>
          </CRow>
          </CFormGroup>
          <CFormGroup>
                {
                  socPrice.map((socPrice, index)=>(
                    <CRow className="g-3 align-items-center">
                        <CCol md="6" sm="4">
                            <CLabel>Enter Sub Category</CLabel>
                        </CCol>
                        <CCol sm={5}>
                          <CInputGroup className="mb-3" key={index}>
                            <CInput
                                    type="text"
                                    placeholder="Enter Sub Category"
                                    name={index}
                                    value={socPrice}
                                    // onChange={(e) => {
                                    //   Change(e, index);
                                    //   // setFormData({
                                    //   //   ...formData.values,
                                    //   //   name: e.target.value
                                    //   // })
                                    // }}
                                    readOnly
                                    />
                                    <CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545",marginLeft:"10px", borderRadius:"0.25rem" }} type="button" color="secondary" variant="outline" onClick={() => deleteVideo(socPrice)}>Delete</CButton>          
                          </CInputGroup>
                        </CCol>
                    </CRow>
                  ))
                }
              
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

export default EditSubcat;

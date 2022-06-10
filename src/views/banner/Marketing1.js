import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CForm,
  CRow,
  CFormGroup,
  CLabel,
  CInput,
  CInputGroup,
  CButton,
  CProgress,
  CProgressBar,
  CSpinner,
  CTextarea,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem
} from "@coreui/react";
import ServiceName from "../ServiceNameComponent";
import SubServiceName from "../SubServiceNameComponent";
import firebase from "../../config/fbconfig";

// import { getMessaging, getToken } from "../../config/fbconfig";
import CustomerName from "../CustomerNameComponent";
import { useFormik } from "formik";

const Marketing1 = (props) => {
  const history = useHistory();

  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const PriceData = {mobile : "",}
  const [mobile, setMobile] = useState([PriceData]);

  const [state, setState] = useState({
    orders: null,
    users: null,
  });
  const initialFormData = {
    message:"",
  };
 
  const formData = useFormik({
    initialValues: initialFormData,
  });

  useEffect(() => {
    // getOrders();
    getSocietyName();
  }, []);
  const [cat, setCat] = useState([]);
  const getSocietyName = async () => {
    const response = await firebase.firestore().collection("centers");
    const data = await response.get();
    data.docs.forEach((item) => {
      cat.push({ docId: item.id, ...item.data() });
    });
    setCat([...cat, cat]);
  };
 
const [para, setPara] = useState("");
const selectSociety = async (s) => {
  
  setPara(s)
  
  // const users = await firebase.firestore().collection("users").where("userType","==",s).get();
};console.log(para) 
  let mob1 =[];
const [mob, setMob] = useState([]);
const addNumbers = async () => {
   const users = await firebase.firestore().collection("users").where("societyName","==",para).get();
   users.docs.map((user) => { 
     
    mob1.push(user.data().firebaseToken)
    setMob(mob1) 
   })
   
  //  const resolvedUsers = users.docs.map((user) => {
  //   const id = user.id;
  //   const userData = user.data();

  //   return {
  //     ...userData,
  //     id: id,
  //     customerName: userData.name,
  //     customerNumber:userData.mobile,
  //     customerToken:userData.firebaseToken,
  //     societyName: userData.societyName,
  //     userType:userData.userType,
  //     address:userData.address,
  //     centerId:userData.centerId,
  //     customerEmail:userData.email,
  //     wing:userData.wing,
  //     flatNo:userData.flatNo
  //   };
  // });
  // // Object.assign(gdata=resolvedUsers)
  // setData(resolvedUsers);
  // setRefresh(!refresh);
};
 
 
const [commonTitle, setCommonTitle] = useState("Important Announcements");
const [comm, setComm] = useState("");
const setCommonMessage = async (s) => {
  console.log(comm)
  setComm(s)
  
  // const users = await firebase.firestore().collection("users").where("userType","==",s).get();
};
firebase.messaging().onMessage(res=>{
  console.log(res)
})
 
// console.log(fbtoken1)
const [userDetails, setUserDetails] = useState();
const sendNotificationDelivery = async () =>{
 console.log(mob)
  let body = {
   
    registration_ids : mob,
    notification : {
       title : commonTitle,
       body : comm
    }
  }
  let options ={
    method: "POST",
    headers: new Headers({
     Authorization:"key=AAAAqSRLoRY:APA91bHFoF0yF6m2a0R3y18qi2HCTDVoy1apvfOSa5CntuuAb9kwahEDRsuuf3rEFyNc8p-ZI6s7HCN2YbugULSPK1kJSzfZercx8S4_XJKcdAIwO3xpo4KfTuOeRYjrwKjNStF6Jwvi",
     "Content-Type":"application/json"
   }),
  //  body:JSON.parse(JSON.stringify(body)) 
   body:JSON.stringify(body)
  }
  fetch("https://fcm.googleapis.com/fcm/send", options).then(res=>res.json()).then(data=>{
           console.log(data)
     }).catch(e=>console.log(e))
   console.log(body)
  // console.log(res.data())
  // setUserDetails(res.data().customerToken)
 
 

}






  const addPrice = () => {   
    setMobile([...mobile, PriceData]);
  };
  const Change = (e, index) =>{
    const updateddata = mobile.map((mobile,i) => index == i ?
    Object.assign(mobile,{[e.target.name]: e.target.value}) : mobile );
    setMobile(updateddata);
  };
  const remove = (index) => {
    const filterdata = [...mobile];
    filterdata.splice(index,1);
    setMobile(filterdata);
  };
 
  // Define a condition which will send to devices which are subscribed
// to either the Google stock or the tech industry topics.
const registrationTokens = [
  'dzZw3dfTQ0aFK1N4aYq0b8:APA91bHN8PwxvE5Ay6_Xlp5eSWlihsXI7aI0KzlZgnu2RpjlyFk3Rvg1WX0i2h_IEnzm4In6J1ORpif6uvc8CTDTAEqWesDmccLgkkFdFVTMPRn0y3RUfegFC2SMoV9d_HQQCEduGEuX',

];
const notice = () => {
//   firebase.firestore().collection("notice").document('notifications/{message}').onCreate(async (snap, context) => {
//     const newData = snap.data();
//     var payload = {
//         notification: {
//             title: newData.title,
//             body: newData.message,
//             channel_id: 'MEETME',
//             android_channel_id: "MEETME",
//             priority: "high"
//         }
//     };
//     try {
//         const response = await firebase.messaging().sendAll(payload);
//         console.log('Notification sent successfully');
//     } catch (err) {
//         console.log(err);
//     }

// });
//   // Cloud Function
// // This registration token comes from the client FCM SDKs.
var registrationToken = 'dzZw3dfTQ0aFK1N4aYq0b8:APA91bHN8PwxvE5Ay6_Xlp5eSWlihsXI7aI0KzlZgnu2RpjlyFk3Rvg1WX0i2h_IEnzm4In6J1ORpif6uvc8CTDTAEqWesDmccLgkkFdFVTMPRn0y3RUfegFC2SMoV9d_HQQCEduGEuX';

// // See the "Defining the message payload" section below for details
// // on how to define a message payload.
var payload = {
  notification: {
    title: "newData.title",
    body: "newData.message",
    // channel_id: 'MEETME',
    // android_channel_id: "MEETME",
    priority: "high"
},
  // data: {
  //   score: '850',
  //   time: '2:45',
  // },
}
      try {
        firebase.messaging().sendAll(registrationToken, payload)
        .then((response) => {
          // Response is a message ID string.
          console.log('Successfully sent message:', response);
        })
        .catch((error) => {
          console.log('Error sending message:', error);
        });
          // const response = await firebase.messaging().sendAll(payload);
          console.log('Notification sent successfully');
      } catch (err) {
          console.log(err);
      }
  


//  const msg=firebase.messaging();
//     msg.requestPermission().then(()=>{
//       return msg.getToken();
//     }).then((data)=>{
//       console.warn("token",data)
//     }).catch(error =>{
//       console.log(error);
//     })

// const messaging =  firebase.messaging().getToken()(messaging, { vapidKey: 'BI2h7I5cja8N9wu8sdkNNeN3B82kgQf_YRvPdnEFGjmbJxSqSqxQ9dU4uUH8EukbNjQwAXcjqr_AKBjEuAiia34' }).then((currentToken) => {
//   if (currentToken) {
//     console.log(currentToken);
//     // Send the token to your server and update the UI if necessary
//     // ...
//   } else {
//     // Show permission request UI
//     console.log('No registration token available. Request permission to generate one.');
//     // ...
//   }
// }).catch((err) => {
//   console.log('An error occurred while retrieving token. ', err);
//   // ...
// });
}

  // const getOrders = async () => {
  //   // var today = new Date().format("yyyy-MM-ddThh:mm:ss")
  //   const value = (
  //     await firebase.firestore().collection("orders").get()
  //   ).docs.filter((doc) => {
  //     return !doc.data().provider_id;
  //   });
  //   // .catch(e => {
  //   //   setState({ ...state })
  //   // });

  //   // Promise.all(value.docs.map(doc => {
  //   //   return firebase.firestore().collection('providers').doc(doc.data().provider_id).get();
  //   // })).then(providers => {
  //   //   providers = providers.map(doc => ({ ...doc.data(), id: doc.id }));
  //   //   // console.log(providers);
  //   //   setState({
  //   //     ...state,

  //   //     orders: value.docs.filter(doc => {
  //   //       if (!(doc.data().provider_id && (doc.data().service && doc.data().service['service_id'] && doc.data().service['sub_service_id']))) {
  //   //         console.log(doc.data());
  //   //       }
  //   //       return doc.data().provider_id && (doc.data().service && doc.data().service['service_id'] && doc.data().service['sub_service_id']);
  //   //     }).map(doc => {

  //   //       return {
  //   //         ...doc.data(),
  //   //         provider_name: providers.find(provider => provider.id === doc.data().provider_id).name,
  //   //         id: doc.id,
  //   //       }
  //   //     }).sort(compare),

  //   //   })
  //   // })
  //   // console.log(value);

  //   setState({
  //     ...state,

  //     orders: value
  //       .map((doc) => {
  //         console.log(doc.data());
  //         return {
  //           ...doc.data(),
  //           id: doc.id,
  //         };
  //       })
  //       .filter(
  //         (order) => order.service.sub_service_id && order.service.service_id
  //       )
  //       // .sort(compare),
  //   });
  // };

  console.log(comm)


 
  return (
    <CRow>
      <CCol xl={12}>
        <CCard>
        <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >Send Bulk SMS</CCardHeader>
          <CCardBody>
            <CForm>
              {/* <CFormGroup>
                  {
                    mobile.map((mobile, index)=>(
                      <CRow className="g-3 align-items-center">
                          <CCol md="3" sm="12">
                              <CLabel>Enter Mobile Number</CLabel>
                          </CCol>
                          <CCol sm={5}>
                            <CInputGroup className="mb-3" key={index}>
                              <CInput
                                      type="text"
                                      placeholder="Enter Mobile Number"
                                      name="mobile"
                                      value={mobile.mobile}
                                      onChange={(e) => {
                                        Change(e, index);
                                        // setFormData({
                                        //   ...formData.values,
                                        //   name: e.target.value
                                        // })
                                      }}
                                      />
                                      {
                                          index === 0? <CButton style={{ color: "#fff",backgroundColor: "#f8b11c",borderColor: "#f8b11c",marginLeft:"10px", borderRadius:"0.25rem" }} type="button" color="secondary" variant="outline" onClick={addPrice}>Add</CButton>
                                          :<CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545",marginLeft:"10px", borderRadius:"0.25rem" }} type="button" color="secondary" variant="outline" onClick={() => remove(index)}>Delete</CButton>
                                      }
                                      
                            </CInputGroup>
                            </CCol>
                      </CRow>
                    ))
                  }
                
            </CFormGroup> */}
            <CFormGroup>
            <CCol lg="5" md="3" sm="12"><CDropdown style={{ border: "1px solid #d8dbe0", borderRadius:"0.25rem" }}>
                                  <CDropdownToggle
                                    caret
                                    varient={"outline"}
                                  >
                                 Select Society
                                  </CDropdownToggle>
                                  <CDropdownMenu style={{ width: "100%"}}>
                                   <CDropdownItem header>Select Society</CDropdownItem>
                                    <CDropdownItem divider />
                                    {cat.map((it) => (
                                      
                                       <CDropdownItem onClick={() =>selectSociety(it.centerName)} >{it.centerName}</CDropdownItem> ))}
                                    
                                     
                                  </CDropdownMenu>
                        </CDropdown></CCol>
                                    <br></br>
                        <CCol lg="3" md="3" sm="12">
                        <CButton
                                  style={{
                                    color: "#fff",
                                    backgroundColor: "#f8b11c",
                                    borderColor: "#f8b11c",
                                    borderRadius: "0.25rem",
                                     
                                  }}
                                  type="button"
                                  color="secondary"
                                  variant="outline"
                                  onClick={() => addNumbers()}
                                >
                                  Add Society
                                </CButton>
                          </CCol><br></br>
              <CRow >
                {/* <CCol md="3" sm="12">
                  <CLabel htmlFor="inputmessage">Message</CLabel>
                </CCol> */}
                <CCol md="8" sm="12">
                      <CTextarea
                        required 
                        type="text"
                        placeholder="Enter Message"
                        name="message"
                        value={comm}
                        onChange={(e) => {
                          setCommonMessage(e.target.value)
                          
                        }}
                      />
                  </CCol>
                </CRow>
            </CFormGroup>
            {/* {showProgress && (
                    <CProgress className="mb-3">
                    <CProgressBar value={progress}>{progress}%</CProgressBar>
                    </CProgress>
                )} */}

                {/* <CFormGroup>
                <CCol md={12}style={{ display: "flex" }}>
                    {submitLoading ? (
                    <CSpinner size="small" color="info" />
                    ) : (
                    <CButton type="submit" style={{color: "#fff",backgroundColor: "#f8b11c",borderColor: "#f8b11c",marginLeft: "auto",marginRight:"auto",marginTop:"10px"}} disabled={submitLoading}>
                            Send Bulk SMS
                            </CButton>
                    )}
                    </CCol>
                    </CFormGroup> */}
                    <br></br>
                     <CFormGroup><CButton style={{ color: "#fff",backgroundColor: "#f8b11c",borderColor: "#f8b11c", borderRadius:"0.25rem", marginRight:"5px", width:"120px",height:"55px" }} type="button" color="secondary" variant="outline"  onClick={async() =>{
                                      await sendNotificationDelivery()
                                        }}>Send Bulk SMS</CButton></CFormGroup>  
            </CForm>
            {/* <CDataTable
              items={state.orders}
              fields={[
                { key: "ticketId", label: "Ticket ID", filter: true },
                { key: "timestamp", label: "Last updated", filter: true },
                // { key: 'provider_name', filter: true, label: 'Employee' },
                // { key: 'customer', filter: false },
                { key: "service name", filter: false },
                { key: "sub service name", filter: false },
                { key: "PaymentStatus", filter: false },
                { key: "status", label: "Work Status", filter: true },
                { key: "time", label: "Service Time", filter: true },
              ]}
              scopedSlots={{
                // 'provider_name': (item) => {
                //   return (<td>  <ServiceProviderName id={item["provider_id"]}></ServiceProviderName></td>);
                // },
                PaymentStatus: (item) => {
                  return (
                    <td>
                      {" "}
                      {item["amountPaid"] < item["total"] ? (
                        <CBadge color="danger">Pending</CBadge>
                      ) : (
                        <CBadge color="success">Paid</CBadge>
                      )}{" "}
                    </td>
                  );
                },
                customer: (item) => {
                  return (
                    <td>
                      {" "}
                      <CustomerName
                        id={item["customer_id"]}
                      ></CustomerName>{" "}
                    </td>
                  );
                },
                "service name": (item) => {
                  return (
                    <ServiceName
                      serviceId={item.service["service_id"]}
                    ></ServiceName>
                  );
                },
                "sub service name": (item) => {
                  return (
                    <SubServiceName
                      serviceId={item.service["service_id"]}
                      subServiceId={item.service["sub_service_id"]}
                    ></SubServiceName>
                  );
                },
              }}
              hover
              striped
              columnFilter
              clickableRows
              onRowClick={(item) => history.push(`/orders/${item.id}`)}
            /> */}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Marketing1;
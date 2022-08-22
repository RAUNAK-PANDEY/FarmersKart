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
  CDropdownItem,
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
  const PriceData = { mobile: "" };
  const [mobile, setMobile] = useState([PriceData]);

  const [state, setState] = useState({
    orders: null,
    users: null,
  });
  const initialFormData = {
    message: "",
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
    const response = await firebase.firestore().collection("centers").orderBy("centerName");
    const data = await response.get();
    data.docs.forEach((item) => {
      cat.push({ docId: item.id, ...item.data() });
    });
    setCat([...cat, cat]);
  };

  const [para, setPara] = useState("");
  const [market, setMarket] = useState("");
  const selectSociety = async (s) => {
    setPara(s);

    // const users = await firebase.firestore().collection("users").where("userType","==",s).get();
  };

  // console.log(para);

  const selectType = async (s1) => {
    setMarket(s1);
    if (s1 == "Society") {
      getSocietyName();
    }

    // const users = await firebase.firestore().collection("users").where("userType","==",s).get();
  };
  // console.log(market);
  let mob1 = [];
  const [mob, setMob] = useState([]);

  let mob2 = [];
  const [mdb, setMdb] = useState([]);
  const addNumbers = async () => {
    const users = await firebase
      .firestore()
      .collection("users")
      .where("societyName", "==", para)
      .get();
    users.docs.map((user) => {
      mob1.push(user.data().firebaseToken);
      setMob(mob1);
      mob2.push(user.id);
      setMdb(mob2);
    });

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
  const selectTypeAll = async (s) => {
    setMarket(s);
    const users = await firebase.firestore().collection("users").get();
    users.docs.map((user) => {
      mob1.push(user.data().firebaseToken);
      mob2.push(user.id);
      setMdb(mob2);
      setMob(mob1);
    });
  };
  const selectTypeMultiple = async (s) => {
   
    // setMarket(s);
    const users = await firebase.firestore().collection("users").where("societyName" , "==" , s).get();
    // console.log(users)
    users.docs.map((user) => {
      mob.push(user.data().firebaseToken);
      setMob([...mob , mob]);
      mdb.push(user.id);
      setMdb([...mdb , mdb]);
    });
  };
  
  // console.log(mob1);
  const [oneData, setOneData] = useState("");
  const addOne = async (s) => {
    const users = await firebase
      .firestore()
      .collection("users")
      .where("mobile", "==", oneData)
      .get();
    users.docs.map((user) => {
      mob1.push(user.data().firebaseToken);
      setMob(mob1);

    });
  };
  const [commonTitle, setCommonTitle] = useState("Important Announcements");
  const [comm, setComm] = useState("");
  const setCommonMessage = async (s) => {
    setComm(s);

    // const users = await firebase.firestore().collection("users").where("userType","==",s).get();
  };
  firebase.messaging().onMessage((res) => {
    console.log(res);
  });

  // console.log(fbtoken1)
  const [userDetails, setUserDetails] = useState();
  const sendNotificationDelivery = async () => {
    let body = {
      registration_ids: mob,
      notification: {
        title: commonTitle,
        body: comm,
      },
    };
    let options = {
      method: "POST",
      headers: new Headers({
        'Content-Type': "application/json",
        'Authorization':
          "key=AAAAqSRLoRY:APA91bHFoF0yF6m2a0R3y18qi2HCTDVoy1apvfOSa5CntuuAb9kwahEDRsuuf3rEFyNc8p-ZI6s7HCN2YbugULSPK1kJSzfZercx8S4_XJKcdAIwO3xpo4KfTuOeRYjrwKjNStF6Jwvi",
      }),
      //  body:JSON.parse(JSON.stringify(body))
      body: JSON.stringify(body)
      // data: JSON.stringify(msg)
    };
    fetch("https://fcm.googleapis.com/fcm/send", options)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setComm("");
        setMob([]);
        mdb.map(async(sub)=>{
          var ref =await firebase.firestore().collection("users").doc(sub).collection("notifications").doc();
          var myId = ref.id;
          // try {
                  await ref.set({
                    date:new Date(),
                    message: comm,
                    notification_id:myId,
                    orderId:""
                  });
        })
        setMdb([])
      })
      .catch((e) => console.log(e));
    // console.log(res.data())
    // setUserDetails(res.data().customerToken)
  };

  const addPrice = () => {
    setMobile([...mobile, PriceData]);
  };
  const Change = (e, index) => {
    const updateddata = mobile.map((mobile, i) =>
      index == i
        ? Object.assign(mobile, { [e.target.name]: e.target.value })
        : mobile
    );
    setMobile(updateddata);
  };
  const remove = (index) => {
    const filterdata = [...mobile];
    filterdata.splice(index, 1);
    setMobile(filterdata);
  };

  var e1 = document.getElementById("market");
  if (e1) {
    let marketopt = e1.options[e1.selectedIndex].text;
    // console.log(marketopt);
  }

  return (
    <CRow>
      <CCol xl={12}>
        <CCard>
          <CCardHeader
            style={{
              fontWeight: "bold",
              backgroundColor: "#f7f7f7",
              fontSize: "1.1rem",
              color: "black",
            }}
          >
            Send Bulk SMS
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CFormGroup>
                <CCol lg="5" md="3" sm="12">
                  <CDropdown
                    style={{
                      border: "1px solid #d8dbe0",
                      borderRadius: "0.25rem",
                    }}
                  >
                    <CDropdownToggle caret varient={"outline"}>
                      {market === "" ? "Select" : market}
                    </CDropdownToggle>
                    <CDropdownMenu style={{ width: "100%" }}>
                      <CDropdownItem header>Select</CDropdownItem>
                      <CDropdownItem divider />
                      <CDropdownItem onClick={() => selectTypeAll("All")}>
                        All
                      </CDropdownItem>
                      <CDropdownItem onClick={() => selectType("Society")}>
                        Society
                      </CDropdownItem>{" "}
                      <CDropdownItem onClick={() => selectType("One")}>
                        One
                      </CDropdownItem>
                      <CDropdownItem onClick={() => selectType("Multiple")}>
                        Multiple
                      </CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </CCol>
                <br></br>
                {market == "Society" ? (
                  <div>
                    <CCol lg="5" md="3" sm="12">
                      <CDropdown
                        style={{
                          border: "1px solid #d8dbe0",
                          borderRadius: "0.25rem",
                        }}
                      >
                        <CDropdownToggle caret varient={"outline"}>
                          {para === "" ? "Select Society" : para}
                        </CDropdownToggle>
                        <CDropdownMenu style={{ width: "100%" }}>
                          <CDropdownItem header>Select Society</CDropdownItem>
                          <CDropdownItem divider />
                          {cat.map((it) => (
                            <CDropdownItem
                              onClick={() => selectSociety(it.centerName)}
                            >
                              {it.centerName}
                            </CDropdownItem>
                          ))}
                        </CDropdownMenu>
                      </CDropdown>
                    </CCol>
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
                    </CCol>
                    <br></br>
                  </div>
                ) : (
                  ""
                )}
                {market == "One" ? (
                  <CRow className="g-3 align-items-center">
                    <CCol md="3" sm="12">
                      <CLabel>Enter Mobile Number</CLabel>
                    </CCol>
                    <CCol sm={5}>
                      <CInputGroup className="mb-3">
                        <CInput
                          type="text"
                          placeholder="Enter Mobile Number"
                          name="mobile"
                          onChange={(e) => {
                            setOneData(e.target.value);
                          }}
                        />
                      </CInputGroup>
                    </CCol>
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
                        onClick={() => addOne()}
                      >
                        Add Number
                      </CButton>
                    </CCol>
                  </CRow>
                ) : (
                  ""
                )}

              {market == "Multiple" ? (
                  <CRow className="g-3 align-items-center">
                  
                  <CCol md={12} lg={6} sm={12}>
                    <CInputGroup className="mb-3">
                    <table class="table table-bordered table-striped">
                      <tbody>
                          
                          {cat !== undefined && cat.map((it) => (
                             <tr>
                             {it.centerName}
                            <CInput type="checkbox" onChange={(e)=>selectTypeMultiple(it.centerName)}/>
                         
                            </tr>
                             
                          ))}
                          
                          
                      </tbody>
                      </table>       
                    </CInputGroup>
                  </CCol>
              </CRow>
                ) : (
                  ""
                )}

                <CRow>
                  <CCol md="3" sm="12">
                  <CLabel htmlFor="inputmessage">Message</CLabel>
                </CCol>
                  <CCol md="8" sm="12">
                    <CTextarea
                      required
                      type="text"
                      placeholder="Enter Message"
                      name="message"
                      value={comm}
                      onChange={(e) => {
                        setCommonMessage(e.target.value);
                      }}
                    />
                  </CCol>
                </CRow>
              </CFormGroup>
              <br></br>
              <CFormGroup>
                <CButton
                  style={{
                    color: "#fff",
                    backgroundColor: "#f8b11c",
                    borderColor: "#f8b11c",
                    borderRadius: "0.25rem",
                    marginRight: "5px",
                    width: "120px",
                    height: "55px",
                  }}
                  type="button"
                  color="secondary"
                  variant="outline"
                  onClick={async () => {
                    await sendNotificationDelivery();
                  }}
                >
                  Send Bulk SMS
                </CButton>
              </CFormGroup>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Marketing1;

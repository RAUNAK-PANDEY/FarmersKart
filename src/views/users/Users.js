import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CNav,
  CNavItem,
  CNavLink,
  CTabs,
  CTabPane,
  CTabContent,
  CInputGroup,
  CLabel,
  CInput,
  CTextarea,
  CDropdown,
  CDropdownToggle,
  CDropdownItem,
  CDropdownMenu,
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { exportDataToXLSX } from "../../utils/exportData";

window.def = 1;
window.pro = 0;
window.lef = 0;
window.del = 0;
const Users = () => {
  const history = useHistory();

  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const socData = Date.now() - (30*(24 * 60 * 60 * 1000));
  const curData = Date.now();
  var[pdate, setPdate] = useState(socData);
  var[date, setDate] = useState(curData);
  const [order, setOrder] = useState("");
  const [porder, setPorder] = useState("");
  const [lorder, setLorder] = useState("");
  const [dorder, setDorder] = useState("");
  const [cat, setCat] = useState([]);
  const [data, setData] = useState([]);

  var [state, setState] = useState({
    users: null,
    porder: null,
    lorder: null,
    dorder: null,
  });
  const[sName,setSName]=useState([]);
  var [stock, setStock] = useState({
    name: ([]),
});

  useEffect(() => {
    getUsers();
    getPostorder();
    getLorder();
    getDeliverorder();
    getPackage();
  }, []);
  useEffect(() => {
    fliteredSocData();
  }, [refresh]);

  const getPackage = async () => {
    const response = await firebase
      .firestore()
      .collection("generalData")
      .doc("data")
      .get();
    response.data().packersName.map((sub1) => {
      return data.push(sub1);
    });
    setData([...data, data]);
  };
  const getUsers = async () => {
    setLoading(true);
    const users = await firebase
      .firestore()
      .collection("orders")
      .where("userType", "==", "Society")
      .where("isCancelled", "==", false)
      .where("isCancelled", "==", false)
      .where("orderStatus", "==", "placed")
      .get();
    setOrder(users.docs.length);
    // filter((x) => x.orderStatus === 'placed')

    const resolvedUsers = users.docs.map((user) => {
      const id = user.id;
      const userData = user.data();

      return {
        ...userData,
        id: id,
        cid: userData.customerId,
        ddate: new Intl.DateTimeFormat(['ban', 'id'], {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(userData.datePlaced),
        date: userData.datePlaced,
        amount: userData.totalAmount,
        cname: userData.customerName,
        cemail: userData.customerEmail,
        cphno: userData.customerNumber,
        fno: userData.flatNo,
        wing: userData.wing,
        socName: userData.societyName,
        status: userData.orderStatus,
        payment: userData.payment,
        packedBy: userData.packedBy,
        deliveryInstructions:userData.deliveryInstructions,
        oitems: userData.items.map((sub) => {
          return sub.name;
        }),

        // name: userData.name || "Not Defined",
        // whatsAppNumber: userData.whatsAppNumber || "-",
        // referralCode: userData.referralCode
        //   ? userData.referralCode.toString()
        //   : "",
        // primaryAddress:
        //   userData.addresses && userData.addresses.length > 0
        //     ? `${userData.addresses[0].line1}, ${userData.addresses[0].line2}, ${userData.addresses[0].city}, ${userData.addresses[0].state}`
        //     : "Not Defined",
        // id: user.id,
      };
    }).sort((b,a)=>{
      let tm1 = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
      }).format(a.date)
      let tm2 = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
      }).format(b.date)
      if(tm1 > tm2)
              {
                return 1;
              }
              else{
                return -1;
              }
    });
    setState({
      ...state,
      users: resolvedUsers,
    });
    setLoading(false);
    // console.log(users.date);
  };
  const getPostorder = async () => {
    setLoading(true);
    const users = await firebase
      .firestore()
      .collection("orders")
      .where("userType", "==", "Society")
      .where("isCancelled", "==", false)
      .where("isCancelled", "==", false)
      .where("orderStatus", "==", "processed")
      .get();
    setPorder(users.docs.length);

    const resolvedUsers = users.docs.map((user) => {
      const id = user.id;
      const userData = user.data();

      return {
        ...userData,
        id: id,
        cid: userData.customerId,
        ddate: new Intl.DateTimeFormat(['ban', 'id'], {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(userData.datePlaced),
        date: userData.datePlaced,
        // ddate:userData.datePlaced,
        amount: userData.totalAmount,
        cname: userData.customerName,
        cemail: userData.customerEmail,
        cphno: userData.customerNumber,
        fno: userData.flatNo,
        wing: userData.wing,
        socName: userData.societyName,
        status: userData.orderStatus,
        payment: userData.payment,
        packedBy: userData.packedBy,
        deliveryInstructions:userData.deliveryInstructions,
        oitems: userData.items.map((sub) => {
          return sub.name;
        }),
      };
    });
    setState({
      ...state,
      porder: resolvedUsers,
    });
    setCat(resolvedUsers);
    setRefresh(!refresh);
    setLoading(false);
    // console.log(users.date);
  };
  const getLorder = async () => {
    setLoading(true);
    const users = await firebase
      .firestore()
      .collection("orders")
      .where("userType", "==", "Society")
      .where("isCancelled", "==", false)
      .where("isCancelled", "==", false)
      .where("orderStatus", "==", "picked")
      .get();
    setLorder(users.docs.length);

    const resolvedUsers = users.docs.map((user) => {
      const id = user.id;
      const userData = user.data();

      return {
        ...userData,
        id: id,
        cid: userData.customerId,
        // ddate:userData.datePicked,
        ddate: new Intl.DateTimeFormat(['ban', 'id'], {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(userData.datePicked),
        deliveryInstructions:userData.deliveryInstructions,
        date: userData.datePicked,
        amount: userData.totalAmount,
        cname: userData.customerName,
        cemail: userData.customerEmail,
        cphno: userData.customerNumber,
        fno: userData.flatNo,
        wing: userData.wing,
        socName: userData.societyName,
        status: userData.orderStatus,
        payment: userData.payment,
        packedBy: userData.packedBy,
        oitems: userData.items.map((sub) => {
          return sub.name;
        }),
      };
    });
    setState({
      ...state,
      lorder: resolvedUsers,
    });
    setLoading(false);
    // console.log(users.date);
  };
  const getDeliverorder = async () => {
    setLoading(true);
    const users = await firebase
      .firestore()
      .collection("orders")
      .where("dateDelivered", ">=", pdate)
      .where("dateDelivered", "<=", date)
      // .where("userType", "==", "Society")
      // .where("isCancelled", "==", false)
      // .where("orderStatus", "==", "delivered")
      .orderBy("dateDelivered","desc")
      .get();
    setDorder(users.docs.length);

    const resolvedUsers = users.docs.map((user) => {
      const id = user.id;
      const userData = user.data();

      return {
        ...userData,
        id: id,
        cid: userData.customerId,
        // ddate:userData.dateDelivered,
        deliveredDate: new Intl.DateTimeFormat(['ban', 'id'],{
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(userData.dateDelivered),
        delDate: userData.dateDelivered,
        deliveryInstructions:userData.deliveryInstructions,
        amount: userData.totalAmount,
        cname: userData.customerName,
        cemail: userData.customerEmail,
        cphno: userData.customerNumber,
        fno: userData.flatNo,
        wing: userData.wing,
        socName: userData.societyName,
        status: userData.orderStatus,
        payment: userData.payment,
        packedBy: userData.packedBy,
        oitems: userData.items.map((sub) => {
          return sub.name;
        }),
        userType:userData.userType,
        isCancelled:userData.isCancelled,
        orderStatus:userData.orderStatus
      };
    });
    setState({
      ...state,
      dorder: resolvedUsers,
    });
    setLoading(false);
    // console.log(users.date);
  };
  const onChangeDate =  (e) => {
    date=new Date(document.getElementById("date-to").value).setHours(23,59,59,999);
    // console.log(new Intl.DateTimeFormat(['ban', 'id'],{
    //   year: "numeric",
    //   month: "2-digit",
    //   day: "2-digit",
    // }).format(date));
    pdate=new Date(document.getElementById("date-from").value).setHours(0,0,0,0);
    getDeliverorder();
  };
  const prev = async (rowId) => {
      window.pro=1;
      window.def=0;
      window.lef=0;
      window.del=0;
    try {
      await firebase.firestore().collection("orders").doc(rowId).update({
        orderStatus: "placed",
      });
      history.push("/");
      history.replace("/users");
      // getUsers();
      // setRefresh(!refresh);
      // getPostorder();
      // alert("Unit Updated");
    } catch (error) {}
  };
  const edit = async (rowId) => {
    window.pro=0;
    window.def=1;
    window.lef=0;
    window.del=0;
    try {
      await firebase.firestore().collection("orders").doc(rowId).update({
        orderStatus: "processed",
      });
      history.push("/");
      history.replace("/users");
      // getPostorder();
      // setRefresh(!refresh);
      // getUsers();
      // getLorder();
      // alert("Unit Updated");
    } catch (error) {}
  };
  const redit = async (rowId) => {
    window.pro=0;
    window.def=0;
    window.lef=1;
    window.del=0;
    try {
      await firebase.firestore().collection("orders").doc(rowId).update({
        orderStatus: "processed",
      });
      history.push("/");
      history.replace("/users");
      // getPostorder();
      // setRefresh(!refresh);
      // getUsers();
      // getLorder();
      // alert("Unit Updated");
    } catch (error) {}
  };
  const del = async (rowId,customerId) => {
      window.pro=1;
      window.def=0;
      window.lef=0;
      window.del=0;
    try {
      await firebase.firestore().collection("orders").doc(rowId).update({
        orderStatus: "picked",
        datePicked: Date.now(),
        isCompleted: false,
      });
      await sendNotificationDelivery(rowId,customerId)
      history.push("/");
      history.replace("/users");
    } catch (error) {}
  };
  const rdel = async (rowId) => {
    window.pro=0;
    window.def=0;
    window.lef=0;
    window.del=1;
  try {
    await firebase.firestore().collection("orders").doc(rowId).update({
      orderStatus: "picked",
      datePicked: Date.now(),
      isCompleted: false,
    });
    history.push("/");
    history.replace("/users");
  } catch (error) {}
};
  const comp = async (rowId,customerId) => {
      window.pro=0;
      window.def=0;
      window.lef=1;
      window.del=0;
    try {
      await firebase.firestore().collection("orders").doc(rowId).update({
        orderStatus: "delivered",
        dateDelivered: Date.now(),
        isCompleted: true,
      });
      await sendNotificationDelivered(rowId,customerId)
      history.push("/");
      history.replace("/users");
    } catch (error) {}
  }
  const onExportData = async (e) => {
    state.porder= cat;
    const filteredData = state.porder
      .filter((user) => {
        for (const filterKey in tableFilters) {
          console.log(
            String(user[filterKey]).search(
              new RegExp("tableFilters[filterKey]", "i")
            )
          );
          if (
            String(user[filterKey]).search(
              new RegExp(tableFilters[filterKey], "i")
            ) >= 0
          ) {
            continue;
          } else {
            return false;
          }
        }
        return true;
      }).filter((x) => x.societyName === status)
      .map((item) => ({
        name: item.cname,
        number: item.cphno,
        wing: item.wing,
        flatNo: item.fno,
        societyName: item.socName,
        totalAmount:item.totalAmount,
        order: item.items.map((sub) => [sub]),
        deliveryInstructions:item.deliveryInstructions
      }));

    // console.log(filteredData);
    exportPDF(filteredData);
    exportDataToXLSX(filteredData, "societyOrderList");
  };
  const exportPDF = (e) => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = "Society Order";
    // const cName = props.location.state.customerName
    const headers = [
      [
        "Customer Details",
        "Wing",
        "Flat No",
        "Society Name",
        "Order[Name,Quantity,Weight]",
        "Delivery Instruction",
      ],
    ];

    const data = e.filter((x) => x.societyName === status).map((elt) => 
    // elt.societyName == status?
    [
      [elt.name + "\n" + elt.number],
      elt.wing,
      elt.flatNo,
      elt.societyName,  
      elt.order.map((sub,index) =>
      sub.map((sub1) =>{
        let text = sub1.weight
        const myArray = text.split(" ");
        var temp=sub1.quantity*myArray[0]
        return([index+1+")",sub1.name+"   ",myArray[1] == "gms"? temp>=1000?(temp/1000)+"Kg" :temp+"gms" :myArray[1] == "ml"?temp>=1000?(temp/1000)+"Liters":temp+"ml":temp+myArray[1]]+"\n")
        // [
        //   sub1.name + " : " + sub1.quantity + " * " + sub1.weight + "\n",
        // ]
      })
    ),
    elt.deliveryInstructions,
  ]);
  // const charge = [["Service Charge: Rs."+props.location.state.serviceCharges]]
  // const footer = [["Total Amount: Rs."+props.location.state.amount]]]

    let content = {
      startY: 50,
      head: headers,
      body: data,
      // content:charge,
      // foot:footer
    };

    // console.log(content);
    // console.log(data);
    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("societyorder.pdf");
  };
  var [ref, setRef] = useState();
  const handleChange = (e) => {
    setRef(e.target.value)
  }
  const deleteVideo = (item, rowId) => {
    confirmAlert({
      title: "Cancel Order",
      message: (
        <CRow>
          <CCol sm={12}>
            <CLabel style={{ marginLeft: "15px" }} rows="3">
              Refund/Cancel :
            </CLabel>
            <select
              style={{
                marginLeft: "21px",
                border: "1px solid #d8dbe0",
                borderRadius: "0.25rem",
                textAlign: "left",
              }}
              id="status"
              onChange={(e) => handleChange(e)}
            >
            <option value="" selected>Select Type</option>
              <option value="Refund">Refund</option>
              <option value="Cancel">Cancel</option>
            </select>
          </CCol>
          <CCol sm={12}>
            <CLabel style={{ marginLeft: "15px" }} rows="3">
              Status :
            </CLabel>
            <select
              style={{
                marginLeft: "21px",
                border: "1px solid #d8dbe0",
                borderRadius: "0.25rem",
                textAlign: "left",
              }}
              id="dropdown"
            >
              <option value="Out Of Stock">Out Of Stock</option>
              <option value="Wrong Item">Wrong Item</option>
              <option value="Quality Issue">Quality Issue</option>
              <option value="Other">Other</option>
            </select>
          </CCol>
          <CLabel style={{ marginLeft: "15px" }}>Comment :</CLabel>
          <br></br>
          <div
            class="form-floating"
            style={{ marginLeft: "15px", color: "#333" }}
            rows="3"
          >
            <textarea
              placeholder="Leave a comment here"
              name="textarea"
              id="floatingTextarea"
            />
          </div>
        </CRow>
      ),
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            var ref = document.getElementById("status").value;
            await firebase
              .firestore()
              .collection("orders")
              .doc(rowId)
              .update({
                orderStatus: "cancelled",
                isCancelled: true,
                comment: document.getElementById("floatingTextarea").value,
                message: document.getElementById("dropdown").value,
              });
              if( ref == "Refund"){
                await firebase
                  .firestore()
                  .collection("users")
                  .doc(item.customerId)
                  .collection("wallet")
                  .add({
                    amount: item.totalAmount,
                    date: Date.now(),
                    message: "Order Cancelled and Amount Added to Wallet",
                    type: "credit",
                  });
                await firebase
                  .firestore()
                  .collection("users")
                  .doc(item.customerId)
                  .update({
                    walletAmount: firebase.firestore.FieldValue.increment(
                      item.totalAmount.valueOf()
                    ),
                  });
                alert("Amount Added to Wallet");
              }
            alert("Order Cancelled!");
            getUsers();
            getPostorder();
            getLorder();
            getDeliverorder();
            setRefresh(!refresh);
          },
        },
        {
          label: "No",
        },
      ],
      closeOnEscape: true,
      closeOnClickOutside: true,
      willUnmount: () => {},
      afterClose: () => {},
      onClickOutside: () => {},
      onKeypressEscape: () => {},
    });
  };
  const packedBy = (id) => {
    // console.log(rowId);
    confirmAlert({
      title: "Packed By",
      message: (
        <CRow>
          <CCol sm={12}>
          <CLabel style={{ marginLeft: "15px"}} rows="3">Status :</CLabel>
            <select
            style={{ marginLeft: "21px",border: "1px solid #d8dbe0",borderRadius: "0.25rem",textAlign: "left"}}
            id="dropdown"
            >
              {data.map((sub1,index) => {
                if (index+1 != data.length) {
                  return <option value={sub1}>{sub1}</option>;
                }
              })}
            </select>
              
              {/* <option value="New">New</option>
        <option value="Process">Process</option>
        <option value="Solved">Solved</option> */}

          </CCol>
          {/* <CLabel style={{ marginLeft: "15px"}}>Comment :</CLabel>
        <br></br>
        <div class="form-floating"style={{ marginLeft: "15px",color:"#333"}} rows="3">
        <textarea placeholder="Leave a comment here" name="textarea" id="floatingTextarea" />
      </div> */}
        </CRow>
      ),
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            // Change(index);
            // var ref = document.getElementById("dropdown").value;
            // console.log(ref);
            // if( ref == "Process"){
            await firebase
              .firestore()
              .collection("orders")
              .doc(id)
              .update({
                packedBy: document.getElementById("dropdown").value,
              });
            // }else if( ref == "Solved"){
            //   await firebase.firestore().collection("queries").doc(id).update({
            //     status:document.getElementById("dropdown").value,
            //     solvedDate:Date.now(),
            //     adminComment:document.getElementById("floatingTextarea").value,
            //   });
            // }

            // await firebase.firestore().collection("orders").doc(props.location.id).update({
            //   items : socPrice,
            // });
            // props.location.state.payment.map(async(sub)=>{
            //   if(sub.method != "COD"){
            //     await firebase.firestore().collection("users").doc(props.location.state.customerId).collection("wallet").add({
            //       amount:sub.amount,
            //       date:Date.now(),
            //       message:"Item Cancelled and Amount Added to Wallet",
            //       type:"credit"
            //     });
            //     await firebase.firestore().collection("users").doc(props.location.state.customerId).update({
            //       walletAmount:firebase.firestore.FieldValue.increment(sub.amount.valueOf())
            //     });
            //     alert("Amount Added to Wallet");
            //   }
            // })
            // var ref = document.getElementById("status").value;
            // console.log(ref);
            // if( ref == "Refund"){
            //   await firebase.firestore().collection("users").doc(props.location.state.customerId).collection("wallet").add({
            //     amount:price,
            //     date:Date.now(),
            //     message:"Item Cancelled and Amount Added to Wallet",
            //     type:"credit"
            //   });
            //   await firebase.firestore().collection("users").doc(props.location.state.customerId).update({
            //           walletAmount:firebase.firestore.FieldValue.increment(price.valueOf())
            //         });
            // alert("Amount Added to Wallet");
            // }
            // alert("Status Updated!");
            history.push("/");
            history.replace("/users");
            // history.push(
            //   {
            //   pathname: '/users',
            //   }
            // )
            // getUsers();
            // setRefresh(!refresh);
          },
        },
        {
          label: "No",
          // onClick: () => alert("Close"),
        },
      ],
      // childrenElement: () =>
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
  const view = async (data, rowId) => {
    history.push({
      pathname: "/users/user",
      state: data,
      id: rowId,
    });
  };
  const fliteredSocData= () =>{
    try{
    var found = false;
        state.porder.map((sub) =>{
            // console.log(sub);
            if (sub.userType == 'Society' && sub.isCancelled == false) {
                // sub.temp.map(async(sub1,index)=>{
                    // console.log(stock.name.indexOf(sub1.name))
                    if (stock.name.indexOf(sub.societyName) > -1) {
                        found = true;
                        // break;
                    }else if (stock.name.indexOf(sub.societyName) == -1) {
                        stock.name.push(sub.societyName);
                        setStock({name:[...stock.name, stock.name]});
                        setSName(stock.name)
                        // console.log(stock.name);
                    }
                    else{
                      //  console.log("Clicked");
                    }
                // })
            }
        })
    }catch (error) {
            }
    
};
const [status, setStatus] = useState("");
let sccount =[]
const updatedStatus = async (s) => {
   
  setStatus(s);
  
  // console.log(cat)
 cat.forEach((cat) => {
      if(cat.socName == s){
         
        sccount.push(s);
      }

  })
   setSocCount(sccount.length)
  // console.log(s);
  // getUsers();
  // getVideos();1
};
const [socCount, setSocCount] = useState(0);


  
const [deliveryTitle, setDeliveryTitle] = useState("Left for Delivery");
const [deliveryMessage, setDeliveryMessage] = useState("Dear Customer , your order is out for delivery, please check the items on delivery and in case of return or replacement request kindly inform our delivery partner");

const [deliveredTitle, setDeliveredTitle] = useState("Delivered");
const [deliveredMessage, setDeliveredMessage] = useState("Dear Customer , your order has been successfully delivered.");

const [cancelledTitle, setCancelledTitle] = useState("Not Deliverable ");
const [cancelledMessage, setCancelledMessage] = useState("Dear Customer, we regret to inform that  in your society we are not serviceable as of now , we will notify you once we start deliveries in your Society. For any queries feel Free to call Us on 8530529100.");

firebase.messaging().onMessage(res=>{
  console.log(res)
})
let fbtoken1 ="";
// state.users && state.users.map(async (sub) =>{
//  fbtoken1 = sub.customerToken
 
                
                         
// })
// console.log(fbtoken1)
const [userDetails, setUserDetails] = useState();
const sendNotificationDelivery = async (id1,customerId) =>{
//   let fbtoken ="";
//   state.users && state.users.map(async (sub) =>{
//      fbtoken = sub.customerToken
     
                    
                             
//  })
//  console.log(fbtoken)
await firebase.firestore().collection("orders").doc(id1).
get().then((res)=>{
  let body = {
    to : res.data().customerToken,
    notification : {
      title : deliveryTitle,
      body : deliveryMessage
    }
  }
  let options ={
    method: "POST",
    headers: new Headers({
     Authorization:"key=AAAAqSRLoRY:APA91bHFoF0yF6m2a0R3y18qi2HCTDVoy1apvfOSa5CntuuAb9kwahEDRsuuf3rEFyNc8p-ZI6s7HCN2YbugULSPK1kJSzfZercx8S4_XJKcdAIwO3xpo4KfTuOeRYjrwKjNStF6Jwvi",
     "Content-Type":"application/json"
   }),
   body:JSON.stringify(body)
  }
  fetch("https://fcm.googleapis.com/fcm/send", options).then(res=>res.json()).then(data=>{
    var ref = firebase.firestore().collection("users").doc(customerId).collection("notifications").doc();
    var myId = ref.id;
    // try {
            ref.set({
              date:new Date(),
              message: deliveryMessage,
              notification_id:myId,
              orderId:id1
            });
          //  console.log(data)
     }).catch(e=>console.log(e))
  //  console.log(body)
  // console.log(res.data())
  // setUserDetails(res.data().customerToken)
})
 

}

const sendNotificationDelivered = async (id1,customerId) =>{
  //   let fbtoken ="";
  //   state.users && state.users.map(async (sub) =>{
  //      fbtoken = sub.customerToken
       
                      
                               
  //  })
  //  console.log(fbtoken)
  await firebase.firestore().collection("orders").doc(id1).
  get().then((res)=>{
    let body = {
      to : res.data().customerToken,
      notification : {
        title : deliveredTitle,
        body : deliveredMessage
      }
    }
    let options ={
      method: "POST",
      headers: new Headers({
       Authorization:"key=AAAAqSRLoRY:APA91bHFoF0yF6m2a0R3y18qi2HCTDVoy1apvfOSa5CntuuAb9kwahEDRsuuf3rEFyNc8p-ZI6s7HCN2YbugULSPK1kJSzfZercx8S4_XJKcdAIwO3xpo4KfTuOeRYjrwKjNStF6Jwvi",
       "Content-Type":"application/json"
     }),
     body:JSON.stringify(body)
    }
    fetch("https://fcm.googleapis.com/fcm/send", options).then(res=>res.json()).then(data=>{
            //  console.log(data)
            var ref =firebase.firestore().collection("users").doc(customerId).collection("notifications").doc();
            var myId = ref.id;
            // try {
                    ref.set({
                      date:new Date(),
                      message: deliveredMessage,
                      notification_id:myId,
                      orderId:id1
                    });
       }).catch(e=>console.log(e))
    //  console.log(body)
    // console.log(res.data())
    // setUserDetails(res.data().customerToken)
  })
   

  }

  const sendNotificationCancelled = async (id1) =>{
    //   let fbtoken ="";
    //   state.users && state.users.map(async (sub) =>{
    //      fbtoken = sub.customerToken
         
                        
                                 
    //  })
    //  console.log(fbtoken)
    await firebase.firestore().collection("handyOrders").doc(id1).
    get().then((res)=>{
      let body = {
        to : res.data().customerToken,
        notification : {
          title : cancelledTitle,
          body : cancelledMessage
        }
      }
      let options ={
        method: "POST",
        headers: new Headers({
         Authorization:"key=AAAAqSRLoRY:APA91bHFoF0yF6m2a0R3y18qi2HCTDVoy1apvfOSa5CntuuAb9kwahEDRsuuf3rEFyNc8p-ZI6s7HCN2YbugULSPK1kJSzfZercx8S4_XJKcdAIwO3xpo4KfTuOeRYjrwKjNStF6Jwvi",
         "Content-Type":"application/json"
       }),
       body:JSON.stringify(body)
      }
      fetch("https://fcm.googleapis.com/fcm/send", options).then(res=>res.json()).then(data=>{
               console.log(data)
         }).catch(e=>console.log(e))
       console.log(body)
      // console.log(res.data())
      // setUserDetails(res.data().customerToken)
    })
     
  
    }
  return (
    <CRow>
      <CCol>
        <CCard>
        <CCardHeader
            className="d-flex justify-content-between align-items-center"
            style={{
              fontWeight: "bold",
              backgroundColor: "#f7f7f7",
              fontSize: "1.1rem",
              color: "black",
            }}
          >
              <CCol sm="3">
                    <div className="font-xl">Order List</div>
                </CCol>
                <CCol sm="1">
                    <div style={{width:"230px",marginLeft:"5px"}}>
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
                            {status ===""?"Select Society":status}
                          </CDropdownToggle>
                          <CDropdownMenu style={{ width: "100%",}}>
                            <CDropdownItem header>Select Society</CDropdownItem>
                            <CDropdownItem divider />
                            {
                              sName.map((cat, index) => {
                                return (
                                  <CDropdownItem
                                  required
                                    onClick={() => updatedStatus(cat)
                                    
                                    }
                                  >
                                    {cat}
                                  </CDropdownItem>
                                );
                              })}
                          </CDropdownMenu>
                        </CDropdown>
                    </div>
                </CCol>
                <CCol sm="1">
                    <div className="font-xl">{socCount}</div>
                </CCol>
                <CCol sm="2">
                    <div>
                    <CButton
                        color="info"
                        className="mr-3"
                        onClick={() => onExportData()}
                      >
                        Export Data
                      </CButton>
                    </div>
                </CCol>
            
              {/* <CButton
                color="primary"
                // onClick={() => history.push("/users/create-user")}
              >
                Create User
              </CButton> */}
          </CCardHeader>
          <CCardBody>
            <CTabs activeTab={window.def==1?"home":window.pro==1?"profile":window.lef==1?"messages":window.del==1?"delivered":""}>
              <CNav variant="tabs">
                <CNavItem>
                  <CNavLink data-tab="home">Order Recieved {order}</CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink data-tab="profile">
                    Order Processed {porder}
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink data-tab="messages">
                    Left For Delivery {lorder}
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink data-tab="delivered">
                    Delivered Order {dorder}
                  </CNavLink>
                </CNavItem>
              </CNav>
              <CTabContent>
                <CTabPane data-tab="home">
                  <CDataTable
                    loading={loading}
                    onColumnFilterChange={(e) => {
                      setTableFilters(e);
                    }}
                    onSorterValueChange={(e) => {
                      console.log(e);
                    }}
                    onTableFilterChange={(filter) => setTableFilters(filter)}
                    items={state.users}
                    fields={[
                      { key: "ddate", label: "Order Date", filter: true },
                      { key: "id", label: "Order Id", filter: true },
                      { key: "cphno", label: "User Details", filter: true },
                      { key: "wing", label: "Wing", filter: true },
                      { key: "fno", label: "Flat No", filter: true },
                      { key: "socName", label: "Society Name", filter: true },
                      { key: "oitems", label: "Order Details", filter: true },
                      { key: "amount", label: "Total Amount", filter: true },
                      { key: "deliveryInstructions", label: "Delivery Instructions", filter: true },
                      { key: "action", label: "Action", filter: false },
                      { key: "packedBy", label: "Packed By", filter: true },
                    ]}
                    scopedSlots={{
                      ddate: (item) => {
                        return (
                          <td>
                            <div>{item.ddate}</div>
                            <div>
                              {new Intl.DateTimeFormat("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                              }).format(item.date)}
                            </div>
                          </td>
                        );
                      },
                      id: (item) => {
                       return <td>{item.id.slice(0, 5)}</td>;
                      },
                      cphno: (item) => {
                        return (
                          <td>
                            <div>
                              <i class="fa fa-phone"></i>
                              {item.cname}
                            </div>
                            <div>{item.cemail}</div>
                            <div>{item.cphno}</div>
                          </td>
                        );
                      },
                      wing: (item) => {
                        return <td>{item.wing}</td>;
                      },
                      fno: (item) => {
                        return <td>{item.fno}</td>;
                      },
                      deliveryInstructions: (item) => {
                        return <td>{item.deliveryInstructions}</td>;
                      },
                      socName: (item) => {
                        return <td>{item.socName}</td>;
                      },
                      oitems: (item) => {
                        return (
                          <td>
                            {item.items.map((sub) => {
                              let text = sub.weight;
                              const myArray = text.split(" ");
                              var temp = sub.quantity * myArray[0];
                              return (
                                  <div>{sub.name} :  <span>{myArray[1] == "gms"? temp>=1000?(temp/1000)+"Kg" :temp+"gms" :myArray[1] == "ml"?temp>=1000?(temp/1000)+"Liters":temp+"ml":temp+myArray[1]}</span></div>
                              );
                            })}
                          </td>
                        );
                      },
                      amount: (item) => {
                        return (
                          <td>
                            {item.payment.map((sub) => {
                              return (
                                <div>
                                  {sub.method} = <b>₹</b>
                                  {sub.amount}
                                </div>
                              );
                            })}
                            <hr
                              style={{
                                width: "100%",
                                marginLeft: "auto",
                                marginRight: "auto",
                                overflow: "hidden",
                                border: "1px solid #333",
                              }}
                            />
                            <div>
                              Total = <b>₹</b>
                              {Math.round(item.amount)}
                            </div>
                          </td>
                        );
                      },
                      mode: (item) => {
                        return <td>{item.mode}</td>;
                      },
                      action: (item, index) => {
                        return (
                          <td>
                            {
                              <CInputGroup style={{ flexWrap: "nowrap" }}>
                                <CButton
                                  style={{
                                    color: "#fff",
                                    backgroundColor: "#f8b11c",
                                    borderColor: "#f8b11c",
                                    borderRadius: "0.25rem",
                                    marginRight: "5px",
                                    width: "120px",
                                    height: "40px",
                                  }}
                                  type="button"
                                  color="secondary"
                                  variant="outline"
                                  onClick={() => edit(item.id)}
                                >
                                  Process
                                </CButton>
                                <CButton
                                  style={{
                                    color: "#fff",
                                    backgroundColor: "#dc3545",
                                    borderColor: "#dc3545",
                                    borderRadius: "0.25rem",
                                    width: "120px",
                                    height: "40px",
                                  }}
                                  type="button"
                                  color="secondary"
                                  variant="outline"
                                  onClick={() => deleteVideo(item, item.id)}
                                >
                                  Refund/Cancel
                                </CButton>
                              </CInputGroup>
                            }
                            <br></br>
                            {
                              <CInputGroup
                                style={{
                                  flexWrap: "nowrap",
                                  marginTop: "-15px",
                                }}
                              >
                                <CButton
                                  style={{
                                    color: "#333",
                                    backgroundColor: "#00000000",
                                    borderColor: "#c7c6c6",
                                    borderRadius: "0.25rem",
                                    marginRight: "5px",
                                    width: "120px",
                                    height: "40px",
                                  }}
                                  type="button"
                                  color="secondary"
                                  variant="outline"
                                  onClick={() => view(item, item.id)}
                                >
                                  View Order
                                </CButton>
                              </CInputGroup>
                            }
                          </td>
                        );
                      },
                    }}
                    hover
                    striped
                    columnFilter
                    sorter
                    pagination
                    itemsPerPage={30}
                    clickableRows
                  />
                </CTabPane>
                <CTabPane data-tab="profile">
                  <CDataTable
                    loading={loading}
                    onColumnFilterChange={(e) => {
                      setTableFilters(e);
                    }}
                    onSorterValueChange={(e) => {
                      console.log(e);
                    }}
                    onTableFilterChange={(filter) => setTableFilters(filter)}
                    items={state.porder}
                    fields={[
                      { key: "ddate", label: "Order Date", filter: true },
                      { key: "id", label: "Order Id", filter: true },
                      { key: "cphno", label: "User Details", filter: true },
                      { key: "wing", label: "Wing", filter: true },
                      { key: "fno", label: "Flat No", filter: true },
                      { key: "socName", label: "Society Name", filter: true },
                      { key: "oitems", label: "Order Details", filter: true },
                      { key: "amount", label: "Total Amount", filter: true },
                      { key: "deliveryInstructions", label: "Delivery Instructions", filter: true },
                      { key: "action", label: "Action", filter: false },
                      { key: "packedBy", label: "Packed By", filter: true },
                    ]}
                    scopedSlots={{
                      ddate: (item) => {
                        return (
                          <td>
                            <div>{item.ddate}</div>
                            <div>
                              {new Intl.DateTimeFormat("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                              }).format(item.date)}
                            </div>
                          </td>
                        );
                      },
                      id: (item) => {
                       return <td>{item.id.slice(0, 5)}</td>;
                      },
                      deliveryInstructions: (item) => {
                        return <td>{item.deliveryInstructions}</td>;
                      },
                      cphno: (item) => {
                        return (
                          <td>
                            <div>
                              <i class="fa fa-phone"></i>
                              {item.cname}
                            </div>
                            <div>{item.cemail}</div>
                            <div>{item.cphno}</div>
                          </td>
                        );
                      },
                      wing: (item) => {
                        return <td>{item.wing}</td>;
                      },
                      fno: (item) => {
                        return <td>{item.fno}</td>;
                      },
                      socName: (item) => {
                        return <td>{item.socName}</td>;
                      },
                      oitems: (item) => {
                        return (
                          <td>
                            {item.items.map((sub) => {
                              let text = sub.weight;
                              const myArray = text.split(" ");
                              var temp = sub.quantity * myArray[0];
                              return (
                                  <div>{sub.name} :  <span>{myArray[1] == "gms"? temp>=1000?(temp/1000)+"Kg" :temp+"gms" :myArray[1] == "ml"?temp>=1000?(temp/1000)+"Liters":temp+"ml":temp+myArray[1]}</span></div>
                              );
                            })}
                          </td>
                        );
                      },
                      amount: (item) => {
                        return (
                          <td>
                            {item.payment.map((sub) => {
                              return (
                                <div>
                                  {sub.method} = <b>₹</b>
                                  {sub.amount}
                                </div>
                              );
                            })}
                            <hr
                              style={{
                                width: "100%",
                                marginLeft: "auto",
                                marginRight: "auto",
                                overflow: "hidden",
                                border: "1px solid #333",
                              }}
                            />
                            <div>
                              Total = <b>₹</b>
                              {Math.round(item.amount)}
                            </div>
                          </td>
                        );
                      },
                      mode: (item) => {
                        return <td>{item.mode}</td>;
                      },
                      action: (item) => {
                        return (
                          <td>
                            {
                              <CInputGroup style={{ flexWrap: "nowrap" }}>
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
                                  onClick={() => del(item.id,item.customerId)}
                                >
                                  Left For Delivery
                                </CButton>
                                <CButton
                                  style={{
                                    color: "#fff",
                                    backgroundColor: "#dc3545",
                                    borderColor: "#dc3545",
                                    borderRadius: "0.25rem",
                                    width: "120px",
                                    height: "55px",
                                  }}
                                  type="button"
                                  color="secondary"
                                  variant="outline"
                                  onClick={() => deleteVideo(item, item.id)}
                                >
                                  Refund/Cancel
                                </CButton>
                              </CInputGroup>
                            }
                            <br></br>
                            {
                              <CInputGroup
                                style={{
                                  flexWrap: "nowrap",
                                  marginTop: "-15px",
                                }}
                              >
                                <CButton
                                  style={{
                                    color: "#333",
                                    backgroundColor: "#00000000",
                                    borderColor: "#c7c6c6",
                                    borderRadius: "0.25rem",
                                    marginRight: "5px",
                                    width: "120px",
                                    height: "55px",
                                  }}
                                  type="button"
                                  color="secondary"
                                  variant="outline"
                                  onClick={() => view(item, item.id)}
                                >
                                  View Order
                                </CButton>
                                <CButton
                                  style={{
                                    color: "#333",
                                    backgroundColor: "#00000000",
                                    borderColor: "#c7c6c6",
                                    borderRadius: "0.25rem",
                                    width: "120px",
                                    height: "55px",
                                  }}
                                  type="button"
                                  color="secondary"
                                  variant="outline"
                                  onClick={() => prev(item.id)}
                                >
                                  Order Recieved
                                </CButton>
                              </CInputGroup>
                            }
                          </td>
                        );
                      },
                      packedBy: (item, index) => {
                        return (
                          <td>
                            {/* //     <CButton
                            //   size="sm"
                            //   className="ml-1"
                            //   style={{ color: "#fff",backgroundColor: "#007bff",borderColor: "#007bff", borderRadius:"0.25rem", marginRight:"5px" }}
                            //   onClick={() => packedBy(item.id)}
                            // > */}
                            {/* {item.packedBy} */}
                            <CButton
                              size="sm"
                              className="ml-1"
                              style={{
                                color: "#fff",
                                backgroundColor: "#007bff",
                                borderColor: "#007bff",
                                borderRadius: "0.25rem",
                                marginRight: "5px",
                              }}
                              onClick={() => packedBy(item.id)}
                            >
                              {item.packedBy}
                            </CButton>
                          </td>
                        );
                      },
                    }}
                    hover
                    striped
                    columnFilter
                    // tableFilter
                    sorter
                    // itemsPerPageSelect
                    pagination
                    itemsPerPage={30}
                    clickableRows
                  />
                </CTabPane>
                <CTabPane data-tab="messages">
                  <CDataTable
                    loading={loading}
                    onColumnFilterChange={(e) => {
                      setTableFilters(e);
                    }}
                    onSorterValueChange={(e) => {
                      console.log(e);
                    }}
                    onTableFilterChange={(filter) => setTableFilters(filter)}
                    items={state.lorder}
                    fields={[
                      { key: "ddate", label: "Delivery Date", filter: true },
                      { key: "id", label: "Order Id", filter: true },
                      { key: "cphno", label: "User Details", filter: true },
                      // { key: "details", label: "User Details", filter: true},
                      { key: "wing", label: "Wing", filter: true },
                      { key: "fno", label: "Flat No", filter: true },
                      { key: "socName", label: "Society Name", filter: true },
                      { key: "oitems", label: "Order Details", filter: true },
                      { key: "amount", label: "Total Amount", filter: true },
                      // { key: "mode", label: "Payment" , filter: true},
                      { key: "deliveryInstructions", label: "Delivery Instructions", filter: true },
                      { key: "action", label: "Action", filter: false },
                      
                      { key: "packedBy", label: "Packed By", filter: true },
                    ]}
                    scopedSlots={{
                      ddate: (item) => {
                        return (
                          <td>
                            <div>{item.ddate}</div>
                            <div>
                              {new Intl.DateTimeFormat("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                              }).format(item.date)}
                            </div>
                          </td>
                        );
                      },
                      id: (item) => {
                       return <td>{item.id.slice(0, 5)}</td>;
                      },
                      deliveryInstructions: (item) => {
                        return <td>{item.deliveryInstructions}</td>;
                      },
                      cphno: (item) => {
                        return (
                          <td>
                            <div>
                              <i class="fa fa-phone"></i>
                              {item.cname}
                            </div>
                            <div>{item.cemail}</div>
                            <div>{item.cphno}</div>
                          </td>
                        );
                      },
                      wing: (item) => {
                        return <td>{item.wing}</td>;
                      },
                      fno: (item) => {
                        return <td>{item.fno}</td>;
                      },
                      socName: (item) => {
                        return <td>{item.socName}</td>;
                      },
                      oitems: (item) => {
                        return (
                          <td>
                            {item.items.map((sub) => {
                              let text = sub.weight;
                              const myArray = text.split(" ");
                              var temp = sub.quantity * myArray[0];
                              return (
                                  <div>{sub.name} :  <span>{myArray[1] == "gms"? temp>=1000?(temp/1000)+"Kg" :temp+"gms" :myArray[1] == "ml"?temp>=1000?(temp/1000)+"Liters":temp+"ml":temp+myArray[1]}</span></div>
                                  
                              );
                            })}
                          </td>
                        );
                      },
                      amount: (item) => {
                        return (
                          <td>
                            {item.payment.map((sub) => {
                              return (
                                <div>
                                  {sub.method} = <b>₹</b>
                                  {sub.amount}
                                </div>
                              );
                            })}
                            <hr
                              style={{
                                width: "100%",
                                marginLeft: "auto",
                                marginRight: "auto",
                                overflow: "hidden",
                                border: "1px solid #333",
                              }}
                            />
                            <div>
                              Total = <b>₹</b>
                              {Math.round(item.amount)}
                            </div>
                          </td>
                        );
                      },
                      mode: (item) => {
                        return <td>{item.mode}</td>;
                      },
                      action: (item, index) => {
                        return (
                          <td>
                            {
                              <CInputGroup style={{ flexWrap: "nowrap" }}>
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
                                  onClick={() => comp(item.id,item.customerId)}
                                >
                                  Delivered
                                </CButton>
                                <CButton
                                  style={{
                                    color: "#fff",
                                    backgroundColor: "#dc3545",
                                    borderColor: "#dc3545",
                                    borderRadius: "0.25rem",
                                    width: "120px",
                                    height: "55px",
                                  }}
                                  type="button"
                                  color="secondary"
                                  variant="outline"
                                  onClick={() => deleteVideo(item, item.id)}
                                >
                                  Refund/Cancel
                                </CButton>
                              </CInputGroup>
                            }
                            <br></br>
                            {
                              <CInputGroup
                                style={{
                                  flexWrap: "nowrap",
                                  marginTop: "-15px",
                                }}
                              >
                                <CButton
                                  style={{
                                    color: "#333",
                                    backgroundColor: "#00000000",
                                    borderColor: "#c7c6c6",
                                    borderRadius: "0.25rem",
                                    marginRight: "5px",
                                    width: "120px",
                                    height: "55px",
                                  }}
                                  type="button"
                                  color="secondary"
                                  variant="outline"
                                  onClick={() => view(item, item.id)}
                                >
                                  View Order
                                </CButton>
                                <CButton
                                  style={{
                                    color: "#333",
                                    backgroundColor: "#00000000",
                                    borderColor: "#c7c6c6",
                                    borderRadius: "0.25rem",
                                    width: "120px",
                                    height: "55px",
                                  }}
                                  type="button"
                                  color="secondary"
                                  variant="outline"
                                  onClick={() => redit(item.id)}
                                >
                                  Order Processed
                                </CButton>
                              </CInputGroup>
                            }
                          </td>
                        );
                      },
                      packedBy: (item, index) => {
                        return (
                          <td>
                            {/* //     <CButton
                            //   size="sm"
                            //   className="ml-1"
                            //   style={{ color: "#fff",backgroundColor: "#007bff",borderColor: "#007bff", borderRadius:"0.25rem", marginRight:"5px" }}
                            //   onClick={() => packedBy(item.id)}
                            // > */}
                            {/* {item.packedBy} */}
                            <CButton
                              size="sm"
                              className="ml-1"
                              style={{
                                color: "#fff",
                                backgroundColor: "#007bff",
                                borderColor: "#007bff",
                                borderRadius: "0.25rem",
                                marginRight: "5px",
                              }}
                              onClick={() => packedBy(item.id)}
                            >
                              {item.packedBy}
                            </CButton>
                          </td>
                        );
                      },
                    }}
                    hover
                    striped
                    columnFilter
                    // tableFilter
                    sorter
                    // itemsPerPageSelect
                    pagination
                    itemsPerPage={30}
                    clickableRows
                    // onRowClick={(item) => history.push(`/users/${item.id}`)}
                  />
                </CTabPane>
                <CTabPane data-tab="delivered">
                <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >
            <CRow>
                <CCol sm="3">
                    <div style={{width:"160px",marginLeft:"5px"}}>
                        From:
                        <span><CInput type="date" id="date-from" name="date-input" placeholder="date"/></span>
                    </div>
                </CCol>
                <CCol sm="1"></CCol>
                <CCol sm="3">
                    <div style={{width:"160px",marginLeft:"5px"}}>
                        To:
                        <span><CInput type="date" id="date-to" name="date-input" placeholder="date" onChange={() => onChangeDate()}/></span>   
                    </div>
                </CCol>
                <CCol sm="1"></CCol>
                <CCol sm="2">
                    {/* <div>
                        <CButton color="info" className="mr-3"
                        onClick={() => onExportData()}
                        style={{ float:"right"}}
                        >
                            Export Data
                        </CButton>
                    </div> */}
                </CCol>
            </CRow>
        </CCardHeader>
                  <CDataTable
                    loading={loading}
                    onColumnFilterChange={(e) => {
                      setTableFilters(e);
                    }}
                    onSorterValueChange={(e) => {
                      console.log(e);
                    }}
                    onTableFilterChange={(filter) => setTableFilters(filter)}
                    items={state.dorder}
                    fields={[
                      { key: "deliveredDate", label: "Delivery Date", filter: true },
                      { key: "delDate", label: "Delivery Time", filter: true },
                      { key: "id", label: "Order Id", filter: true },
                      { key: "cphno", label: "User Details", filter: true },
                      // { key: "details", label: "User Details", filter: true},
                      { key: "wing", label: "Wing", filter: true },
                      { key: "fno", label: "Flat No", filter: true },
                      { key: "socName", label: "Society Name", filter: true },
                      { key: "oitems", label: "Order Details", filter: true },
                      { key: "amount", label: "Total Amount", filter: true },
                      { key: "deliveryInstructions", label: "Delivery Instructions", filter: true },
                      // { key: "mode", label: "Payment" , filter: true},
                      { key: "action", label: "Action", filter: false },
                      { key: "packedBy", label: "Packed By", filter: true },
                    ]}
                    scopedSlots={{
                      deliveredDate: (item) => {
                        return (
                          item.userType == "Society" && item.isCancelled == false && item.orderStatus == "delivered"?
                          <td>
                            <div>{item.deliveredDate}</div>
                          </td>:<td hidden></td>
                        );
                      },
                      deliveryInstructions: (item) => {
                        return <td>{item.deliveryInstructions}</td>;
                      },
                      delDate: (item) => {
                        return (
                          item.userType == "Society" && item.isCancelled == false && item.orderStatus == "delivered"?
                          <td>
                            {/* <div>{item.deliveredDate}</div> */}
                            <div>
                              {new Intl.DateTimeFormat("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                              }).format(item.delDate)}
                            </div>
                          </td>:<td hidden></td>
                        );
                      },
                      id: (item) => {
                        //console.log(item.id.slice(0, 5));
                       return item.userType == "Society" && item.isCancelled == false && item.orderStatus == "delivered"?
                       <td>{item.id.slice(0, 5)}</td>
                       :<td hidden></td>;
                      },
                      cphno: (item) => {
                        return (
                          item.userType == "Society" && item.isCancelled == false && item.orderStatus == "delivered"?
                          <td>
                            <div>
                              <i class="fa fa-phone"></i>
                              {item.cname}
                            </div>
                            <div>{item.cemail}</div>
                            <div>{item.cphno}</div>
                          </td>
                          :<td hidden></td>
                        );
                      },
                      wing: (item) => {
                        return (
                          item.userType == "Society" && item.isCancelled == false && item.orderStatus == "delivered"?
                          <td>
                            <div>{item.wing}</div>
                          </td>
                          :<td hidden></td>
                        );
                      },
                      fno: (item) => {
                        return (
                          item.userType == "Society" && item.isCancelled == false && item.orderStatus == "delivered"?
                          <td>
                            <div>{item.fno}</div>
                          </td>
                          :<td hidden></td>
                        );
                      },
                      socName: (item) => {
                        return (
                          item.userType == "Society" && item.isCancelled == false && item.orderStatus == "delivered"?
                          <td>
                            <div>{item.socName}</div>
                          </td>
                          :<td hidden></td>
                        );
                      },
                      oitems: (item) => {
                        return (
                          item.userType == "Society" && item.isCancelled == false && item.orderStatus == "delivered"?
                          <td>
                            {item.items.map((sub) => {
                              let text = sub.weight;
                              const myArray = text.split(" ");
                              var temp = sub.quantity * myArray[0];
                              return (
                                  <div>{sub.name} :  <span>{myArray[1] == "gms"? temp>=1000?(temp/1000)+"Kg" :temp+"gms" :myArray[1] == "ml"?temp>=1000?(temp/1000)+"Liters":temp+"ml":temp+myArray[1]}</span></div>
                                  
                              );
                            })}
                          </td>
                          :<td hidden></td>
                        );
                      },
                      amount: (item) => {
                        return (
                          item.userType == "Society" && item.isCancelled == false && item.orderStatus == "delivered"?
                          <td>
                            {item.payment.map((sub) => {
                              return (
                                <div>
                                  {sub.method} = <b>₹</b>
                                  {sub.amount}
                                </div>
                              );
                            })}
                            <hr
                              style={{
                                width: "100%",
                                marginLeft: "auto",
                                marginRight: "auto",
                                overflow: "hidden",
                                border: "1px solid #333",
                              }}
                            />
                            <div>
                              Total = <b>₹</b>
                              {Math.round(item.amount)}
                            </div>
                          </td>:<td hidden></td>
                        );
                      },
                      mode: (item) => {
                        return (
                          item.userType == "Society" && item.isCancelled == false && item.orderStatus == "delivered"?
                          <td>
                            <div>{item.mode}</div>
                          </td>
                          :<td hidden></td>
                        );
                      },
                      // mode: (item) => {
                      //   return 
                      //   item.userType == "Society" && item.isCancelled == false && item.orderStatus == "delivered"?
                      //   <td>{item.mode}</td>
                      //   :<td hidden></td>;
                      // },
                      action: (item, index) => {
                        return (
                          item.userType == "Society" && item.isCancelled == false && item.orderStatus == "delivered"?
                          <td>
                            {
                              <CInputGroup style={{ flexWrap: "nowrap" }}>
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
                                  onClick={() => alert("Item Delivered!")}
                                >
                                  Delivered
                                </CButton>
                                <CButton
                                  style={{
                                    color: "#333",
                                    backgroundColor: "#00000000",
                                    borderColor: "#c7c6c6",
                                    borderRadius: "0.25rem",
                                    width: "120px",
                                    height: "55px",
                                  }}
                                  type="button"
                                  color="secondary"
                                  variant="outline"
                                  onClick={() => rdel(item.id)}
                                >
                                  Left For Delivery
                                </CButton>
                              </CInputGroup>
                            }
                            <br></br>
                            {
                              <CInputGroup
                                style={{
                                  flexWrap: "nowrap",
                                  marginTop: "-15px",
                                }}
                              >
                                <CButton
                                  style={{
                                    color: "#333",
                                    backgroundColor: "#00000000",
                                    borderColor: "#c7c6c6",
                                    borderRadius: "0.25rem",
                                    marginRight: "5px",
                                    width: "120px",
                                    height: "55px",
                                  }}
                                  type="button"
                                  color="secondary"
                                  variant="outline"
                                  onClick={() => view(item, item.id)}
                                >
                                  View Order
                                </CButton>
                              </CInputGroup>
                            }
                          </td>
                          :<td hidden></td>
                        );
                      },
                      packedBy: (item, index) => {
                        return (
                          item.userType == "Society" && item.isCancelled == false && item.orderStatus == "delivered"?
                          <td>
                            {/* //     <CButton
                            //   size="sm"
                            //   className="ml-1"
                            //   style={{ color: "#fff",backgroundColor: "#007bff",borderColor: "#007bff", borderRadius:"0.25rem", marginRight:"5px" }}
                            //   onClick={() => packedBy(item.id)}
                            // > */}
                            {/* {item.packedBy} */}
                            <CButton
                              size="sm"
                              className="ml-1"
                              style={{
                                color: "#fff",
                                backgroundColor: "#007bff",
                                borderColor: "#007bff",
                                borderRadius: "0.25rem",
                                marginRight: "5px",
                              }}
                              onClick={() => packedBy(item.id)}
                            >
                              {item.packedBy}
                            </CButton>
                          </td>
                          :<td hidden></td>
                        );
                      },
                    }}
                    hover
                    striped
                    columnFilter
                    // tableFilter
                    sorter
                    // itemsPerPageSelect
                    pagination
                    itemsPerPage={30}
                    clickableRows
                    // onRowClick={(item) => history.push(`/users/${item.id}`)}
                  />
                </CTabPane>
              </CTabContent>
            </CTabs>
          </CCardBody>
        </CCard>
      </CCol>

      {/* <CCol xl={1} /> */}
    </CRow>
  );
};

export default Users;
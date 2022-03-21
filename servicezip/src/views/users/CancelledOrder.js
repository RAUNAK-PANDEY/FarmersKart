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
  CTextarea,
  CDropdown,
  CDropdownToggle,
  CDropdownItem,
  CDropdownMenu,
  CImg,
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { exportDataToXLSX } from "../../utils/exportData";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useFormik } from "formik";

const CancelOrder = () => {
  const history = useHistory();

  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const[order, setOrder] = useState("");
  const[porder, setPorder] = useState("");
  const[lorder, setLorder] = useState("");
  const[dorder, setDorder] = useState("");
  const[cat,setCat]=useState([]);
  var [state, setState] = useState({
    users: null,
    porder: null,
    lorder: null,
    dorder:null,
  });

  useEffect(() => {
    getUsers(); 
    getOrders();
  }, []);

  const getUsers = async () => {
    setLoading(true);
    const users = await firebase.firestore().collection("orders").where("isCancelled","==",true).get();
    setOrder(users.docs.length);
    // filter((x) => x.orderStatus === 'placed')

    const resolvedUsers = users.docs.map((user) => {
      const id = user.id;
      const userData = user.data();

      return {
        ...userData,
        id: id,
        cid:userData.customerId,
        ddate:new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(userData.datePlaced),
        date:userData.datePlaced,
        amount:userData.totalAmount,
        cname:userData.customerName,
        cemail:userData.customerEmail,
        cphno:userData.customerNumber,
        fno:userData.flatNo,
        wing:userData.wing,
        socName:userData.societyName,
        status:userData.orderStatus,
        payment:userData.payment,
        oitems:userData.items.map(sub=>{
            return(sub.name)
        }),
        comment:userData.comment,
        message:userData.message,
        type:userData.userType,

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
    });
    setState({
      ...state,
      users: resolvedUsers,
    });
    setCat(resolvedUsers);
    setLoading(false);
    // console.log(users.date);
  };

  const getOrders = async () => {
    setLoading(true);
    const users = await firebase.firestore().collection("handyOrders").where("isCancelled","==",true).get();
    setPorder(users.docs.length);
    // filter((x) => x.orderStatus === 'placed')

    const resolvedUsers = users.docs.map((user) => {
      const id = user.id;
      const userData = user.data();

      return {
        ...userData,
        id: id,
        cid:userData.userId,
        list:userData.orderList,
        image:userData.imageUrl,
        cname:userData.name,
        // cid:userData.customerId,
        ddate:new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(userData.datePlaced),
        date:userData.datePlaced,
        // mode:userData.paymentMethod,
        amount:userData.totalAmount,
        type:userData.userType,
        cemail:userData.customerEmail,
        cphno:userData.customerNumber,
        fno:userData.flatNo,
        wing:userData.wing,
        socName:userData.societyName,
        comment:userData.comment,
        message:userData.message,

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
    });
    setState({
      ...state,
      porder: resolvedUsers,
    });
    // setCat(resolvedUsers);
    setLoading(false);
    // console.log(users.date);
  };
  // console.log(cat);
//   const prev = async (rowId) => {
//     try {
//       await firebase.firestore().collection("handyOrders").doc(rowId).update({
//         orderStatus : "placed"
//       });
//       history.push('/');
//       history.replace("/users/handy-order");
//       // getUsers();
//       // setRefresh(!refresh);
//       // getPostorder();
//       // alert("Unit Updated");
//     }catch (error) {
//     }
//   };
//   const edit = async (rowId) => {
//     try {
//       await firebase.firestore().collection("handyOrders").doc(rowId).update({
//         orderStatus : "processed"
//       });
//       history.push('/');
//       history.replace("/users/handy-order");
//       // getPostorder();
//       // setRefresh(!refresh);
//       // getUsers();
//       // getLorder();
//       // alert("Unit Updated");
//     }catch (error) {
//     }
//   };
//   const del = async (rowId) => {
//     try {
//       await firebase.firestore().collection("handyOrders").doc(rowId).update({
//         orderStatus : "picked",
//         datePicked : Date.now(),
//         isCompleted:false
//       });
//       history.push('/');
//       history.replace("/users/handy-order");
//     }catch (error) {
//     }
//   };
//   const comp = async (rowId) => {
//     try {
//       await firebase.firestore().collection("handyOrders").doc(rowId).update({
//         orderStatus : "delivered",
//         dateDelivered:Date.now(),
//         isCompleted:true
//       });
//       history.push('/');
//       history.replace("/users/handy-order");
//     }catch (error) {
//     }
//   };
// console.log(state.users);
  const onExportData = async (e) => {
    state.users = cat;
    const filteredData = state.users
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
      })
      .map((item) => ({
        name: item.cname,
        number:item.cphno,
        wing: item.wing,
        flatNo:item.fno,
        societyName:item.socName,
        order:item.items.map(sub=>
            [sub]
          )
      }));

      // console.log(filteredData);
      exportPDF(filteredData);
    // exportDataToXLSX(filteredData, "usersList");
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
    const headers = [["Customer Details", "Wing","Flat No","Society Name","Order[Name,Quantity,Weight]"]];

    const data =e.map(elt => [[elt.name+'\n'+elt.number],elt.wing,elt.flatNo,elt.societyName,elt.order.map(sub =>sub.map(sub1=>[sub1.name+" : "+sub1.quantity+" * "+sub1.weight+'\n']))]);
    // props.location.state.items.map(elt=>
    // const charge = [["Service Charge: Rs."+props.location.state.serviceCharges]]
    // const footer = [["Total Amount: Rs."+props.location.state.amount]]

    let content = {
      startY: 50,
      head: headers,
      body: data,
      // content:charge,
      // foot:footer
    };

    console.log(content);
    console.log(data);
    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("societyorder.pdf")
  }
  const deleteVideo = (item,rowId) => {
    confirmAlert({
      title: "Cancel Order",
      message: <CRow>
      <CCol sm={12}>
      <CLabel style={{ marginLeft: "15px"}} rows="3">Status :</CLabel>
      <select
       style={{ marginLeft: "21px",border: "1px solid #d8dbe0",borderRadius: "0.25rem",textAlign: "left"}}
       id="dropdown"
       >
        <option value="Out Of Stock">Out Of Stock</option>
        <option value="Wrong Item">Wrong Item</option>
        <option value="Quality Issue">Quality Issue</option>
        <option value="Other">Other</option>
      </select>
      </CCol>
        <CLabel style={{ marginLeft: "15px"}}>Comment :</CLabel>
        <br></br>
        <div class="form-floating"style={{ marginLeft: "15px",color:"#333"}} rows="3">
        <textarea placeholder="Leave a comment here" name="textarea" id="floatingTextarea" />
      </div>
      </CRow>,
      buttons: [
        {
          label: "Yes",
          onClick: async() => {
            await firebase.firestore().collection("handyOrders").doc(rowId).update({
              orderStatus : "cancelled",
              isCancelled:true,
              comment:document.getElementById("floatingTextarea").value,
              message:document.getElementById("dropdown").value
            });
            item.payment.map(async(sub)=>{
              if(sub.method != "COD"){
                await firebase.firestore().collection("users").doc(item.customerId).collection("wallet").add({
                  amount:sub.amount,
                  date:Date.now(),
                  message:"Order Cancelled and Amount Added to Wallet",
                  type:"credit" 
                });
                
                await firebase.firestore().collection("users").doc(item.customerId).update({
                  walletAmount:firebase.firestore.FieldValue.increment(sub.amount.valueOf())
                });
                alert("Amount Added to Wallet");
              }
            })
            alert("Order Cancelled!");
            getUsers();
            setRefresh(!refresh);

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
  const view = async(data,rowId) => {
    history.push(
      {
      pathname: '/users/user',
      state: data,
      id: rowId
      }
    )
  };

  return (
    <CRow>
      {/* <CCol xl={1} /> */}
      <CCol>
        <CCard>
          <CCardHeader className="d-flex justify-content-between align-items-center" style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}}>
            <span className="font-xl">Cancelled Order List</span>
            <span>
              <CButton color="info" className="mr-3"
              //  onClick={() => onExportData()}
               >
                Export Data
              </CButton>
              {/* <CButton
                color="primary"
                // onClick={() => history.push("/users/create-user")}
              >
                Create User
              </CButton> */}
            </span>
          </CCardHeader>
          <CCardBody>
          <CTabs activeTab="home">
            <CNav variant="tabs">
              <CNavItem>
                <CNavLink data-tab="home">
                  Cancelled Orders {order}
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink data-tab="profile">
                  Cancelled Handy Orders {porder}
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
                              { key: "ddate", label:"Order Date", filter: true},
                              { key: "id", label: "Order Id", filter: true},
                              { key: "type", label: "User Type", filter: true},
                              { key: "cname", label: "User Details", filter: true},
                              // { key: "details", label: "User Details", filter: true},
                              { key: "wing", label: "Wing", filter: true},
                              { key: "fno", label: "Flat No", filter: true},
                              { key: "socName",label:"Society Name", filter: true},
                              { key: "oitems", label: "Order Details", filter: true},
                              { key: "amount", label: "Total Amount", filter: true },
                              { key: "comment", label: "Comment", filter: true },
                              { key: "message", label: "Message", filter: true },
                              //  // { key: "mode", label: "Payment" , filter: true},
                            //   { key: "action", label: "Action" , filter: false},
                            ]}
                            scopedSlots={{
                              ddate: (item) => {
                                return (
                                  <td>
                                       <div>{item.ddate}</div>
                            <div>{new Intl.DateTimeFormat('en-US', {hour: 'numeric', minute: 'numeric'}).format(item.date)}</div>
                                  </td>
                                );
                              },
                              id: (item) => {
                                return (
                                  <td>
                                      {item.id}
                                  </td>
                                );
                              },
                              type: (item) => {
                                return (
                                  <td>
                                      {item.type}
                                  </td>
                                );
                              },
                              cname: (item) => {
                                  return (
                                    <td>
                                        <div><i class="fa fa-phone"></i>{item.cname}</div>
                                        <div>{item.cemail}</div>
                                        <div>{item.cphno}</div>
                                    </td>
                                  );
                                },
                              wing: (item) => {
                                return (
                                  <td>
                                      {item.wing}
                                  </td>
                                );
                              },
                              fno: (item) => {
                                return (
                                  <td>
                                      {item.fno}
                                  </td>
                                );
                              },
                              socName: (item) => {
                                return (
                                  <td>
                                      {item.socName}
                                  </td>
                                );
                              },
                              oitems:(item)=>{
                                  return(
                                      <td>
                                          {
                                              item.items.map((sub) => {
                                                return(
                                                    <div>{sub.name}</div>
                                                )
                                              })
                                          }
                                      </td>
                                  );
                              },
                              amount: (item) => {
                                return (
                                  <td>
                                      {
                                          item.payment.map(sub=>{
                                              return(<div>{sub.method} = <b>₹</b>{sub.amount}</div>)
                                          }) 
                                      }
                                      <hr style={{width: "100%",marginLeft: "auto",marginRight: "auto",overflow: "hidden",border:"1px solid #333"}}/>
                                      <div>Total = <b>₹</b>{item.amount}</div>
                                  </td>
                                );
                              },
                              comment: (item) => {
                                return (
                                  <td>
                                      {item.comment}
                                  </td>
                                );
                              },
                              message: (item) => {
                                return (
                                  <td>
                                      {item.message}
                                  </td>
                                );
                              },
                            //   action: (item, index) => {
                            //     return (
                            //       <td>
                            //           {
                            //              <CInputGroup style={{flexWrap: "nowrap"}}>
                            //                 <CButton style={{ color: "#fff",backgroundColor: "#f8b11c",borderColor: "#f8b11c", borderRadius:"0.25rem", marginRight:"5px", width:"120px",height:"40px" }} type="button" color="secondary" variant="outline" onClick={() => edit(item.id)}>Process</CButton>
                            //                 <CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545", borderRadius:"0.25rem",width:"120px",height:"40px" }} type="button" color="secondary" variant="outline" onClick={() => deleteVideo(item,item.id)}>Refund/Cancel</CButton>
                            //                 </CInputGroup>
                            //           }<br></br>{
                            //                 <CInputGroup style={{flexWrap: "nowrap",marginTop:"-15px"}}>
                            //                   <CButton style={{ color: "#333",backgroundColor: "#00000000",borderColor: "#c7c6c6", borderRadius:"0.25rem", marginRight:"5px", width:"120px",height:"40px" }} type="button" color="secondary" variant="outline" onClick={() => view(item,item.id)}>View Order</CButton>
                            //                 </CInputGroup>
                            //           }
                            //       </td>
                            //     );
                            //   },
                            }}
                            hover
                            striped
                            columnFilter
                            // tableFilter
                            sorter
                            // pagination
                            // itemsPerPageSelect
                            pagination
                      // itemsPerPage={30}
                            itemsPerPage={30}
                            clickableRows
                            // onRowClick={(item) =>view(item.id)}
                            
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
                    { key: "ddate", label:"Order Date", filter: true},
                    { key: "id", label: "Order Id", filter: true},
                    { key: "type", label: "User Type", filter: true},
                    { key: "cname", label: "User Details", filter: true},
                    // { key: "details", label: "User Details", filter: true},
                    { key: "wing", label: "Wing", filter: true},
                    { key: "fno", label: "Flat No", filter: true},
                    { key: "socName",label:"Society Name", filter: true},
                  //   { key: "oitems", label: "Order Details", filter: true},
                    { key: "image", label: "Order Image", filter: true },
                    { key: "list", label: "Order List" , filter: true},
                    { key: "comment", label: "Comment", filter: true },
                      { key: "message", label: "Message", filter: true },
                    // { key: "action", label: "Action" , filter: false},
                  ]}
                  scopedSlots={{
                    ddate: (item) => {
                      return (
                        <td>
                             <div>{item.ddate}</div>
                            <div>{new Intl.DateTimeFormat('en-US', {hour: 'numeric', minute: 'numeric'}).format(item.date)}</div>
                        </td>
                      );
                    },
                    id: (item) => {
                      return (
                        <td>
                            {item.id}
                        </td>
                      );
                    },
                    type:(item) => {
                      return (
                        <td>
                            {item.type}
                        </td>
                      );
                    },
                    cname: (item) => {
                        return (
                          <td>
                              <div><i class="fa fa-phone"></i>{item.cname}</div>
                              <div>{item.cemail}</div>
                              <div>{item.cphno}</div>
                          </td>
                        );
                      },
                    wing: (item) => {
                      return (
                        <td>
                            {item.wing}
                        </td>
                      );
                    },
                    fno: (item) => {
                      return (
                        <td>
                            {item.fno}
                        </td>
                      );
                    },
                    socName: (item) => {
                      return (
                        <td>
                            {item.socName}
                        </td>
                      );
                    },
                  //   oitems:(item)=>{
                  //       return(
                  //           <td>
                  //               {
                  //                   item.items.map((sub) => {
                  //                     return(
                  //                         <div>{sub.name}</div>
                  //                     )
                  //                   })
                  //               }
                  //           </td>
                  //       );
                  //   },
                  image: (item) => {
                    return (
                      <td>
                          <CImg
                            // key={index}
                            rounded="true"
                            src={item.image}
                            width={160}
                            height={200}
                            />
                          {/* <b>₹</b>{item.amount} */}
                      </td>
                    );
                  },
                  list: (item) => {
                    return (
                      <td>
                          {item.list}
                      </td>
                    );
                  },
                    comment: (item) => {
                      return (
                        <td>
                            {item.comment}
                        </td>
                      );
                    },
                    message: (item) => {
                      return (
                        <td>
                            {item.message}
                        </td>
                      );
                    },
                    // action: (item, index) => {
                    //   return (
                    //     <td>
                    //         {
                    //           <CInputGroup style={{flexWrap: "nowrap"}}>
                    //               <CButton style={{ color: "#fff",backgroundColor: "#f8b11c",borderColor: "#f8b11c", borderRadius:"0.25rem", marginRight:"5px", width:"120px",height:"40px" }} type="button" color="secondary" variant="outline" onClick={() => edit(item.id)}>Process</CButton>
                    //               <CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545", borderRadius:"0.25rem",width:"120px",height:"40px" }} type="button" color="secondary" variant="outline" onClick={() => deleteVideo(item,item.id)}>Refund/Cancel</CButton>
                    //               </CInputGroup>
                    //         }<br></br>{
                    //               <CInputGroup style={{flexWrap: "nowrap",marginTop:"-15px"}}>
                    //                 {/* <CButton style={{ color: "#333",backgroundColor: "#00000000",borderColor: "#c7c6c6", borderRadius:"0.25rem", marginRight:"5px", width:"120px",height:"40px" }} type="button" color="secondary" variant="outline" onClick={() => view(item,item.id)}>View Order</CButton> */}
                    //               </CInputGroup>
                    //         }
                    //     </td>
                    //   );
                    // },
                  }}
                  hover
                  striped
                  columnFilter
                  // tableFilter
                  sorter
                  // pagination
                  // itemsPerPageSelect
                  // itemsPerPage={30}
                  clickableRows
                  // onRowClick={(item) =>view(item.id)}
                  
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

export default CancelOrder;

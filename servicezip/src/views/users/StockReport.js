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
  CInput,
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

const StockReport = () => {
  const history = useHistory();

  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const socData = Date.now() - (24 * 60 * 60 * 1000);
  const curData = Date.now();
  var[order, setOrder] = useState(socData);
//   console.log(order);
//   console.log(new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(order));
  var[porder, setPorder] = useState(curData);
  const[weight,setWeight]=useState([]);
  const[sName,setSName]=useState([]);
  const[sQuantity,setSQuantity]=useState([]);

  const[shopWeight,setShopWeight]=useState([]);
  const[shopName,setShopName]=useState([]);
  const[shopQuantity,setShopQuantity]=useState([]);

  const[hotelWeight,setHotelWeight]=useState([]);
  const[hotelName,setHotelName]=useState([]);
  const[hotelQuantity,setHotelQuantity]=useState([]);
//   const shopPriceData = {
//     weight: "",
//     unit: "",
//     originalPrice: "",
//     discount: "",
//     discountedPrice: "",
//   };
  var [stock, setStock] = useState({
        name: ([]),
        quantity:([]),
        weight: ([]),
        pid:([])
});
var [sstock, setSStock] = useState({
    name: ([]),
    quantity:([]),
    weight: ([]),
});
var [hstock, setHStock] = useState({
    name: ([]),
    quantity:([]),
    weight: ([]),
});
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
  }, []);
  useEffect(() => {
    data();
  }, [refresh]);

  const getUsers = async () => {
    setLoading(true);
    const users = await firebase.firestore().collection("orders").where("datePlaced",">=",order).where("datePlaced","<=",porder).get();
    // filter((x) => x.orderStatus === 'placed')

    const resolvedUsers = users.docs.map((user) => {

      const id = user.id;
      const userData = user.data();

      return {
        ...userData,
        productid: id,
        ddate:new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(userData.datePlaced),
        date:userData.datePlaced,
        amount:userData.totalAmount,
        isCancelled:userData.isCancelled,
        userType:userData.userType,
        temp:userData.items,
        oitems:userData.items.map(sub=>{
            return(sub.name)
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
      
    });
    setState({
      ...state,
      users: resolvedUsers,
    });
    setCat(resolvedUsers);
    setLoading(false);
    // console.log(resolvedUsers);
    setRefresh(!refresh);
  };

const data= () =>{
    try{
    var found = false;
        state.users.map((sub) =>{
            // console.log(sub);
            if (sub.userType == 'Society' && sub.isCancelled == false) {
                sub.temp.map((sub1,index)=>{
                    console.log(stock.name.indexOf(sub1.name));
                    // console.log(sub1);
                    if (stock.name.indexOf(sub1.name) == 0) {
                        
                                    Object.assign(stock.quantity[index]+=sub1.quantity)
                                    setStock({quantity:stock.quantity})
                                    setSQuantity(stock.quantity)
                        found = true;
                        // break;
                    }else if (stock.name.indexOf(sub1.name) == -1) {
                        // stock.pid.push(sub1.productId);
                        // setStock({id:[...stock.pid, stock.pid]});

                        stock.quantity.push(sub1.quantity);
                        setStock({quantity:[...stock.quantity, stock.quantity]});
                        // Object.assign(stock.quantity[index]=sub1.quantity)
                        // setStock({quantity:stock.quantity})
                        setSQuantity(stock.quantity)
    
                        // Object.assign(stock.weight[index]=sub1.weight)
                        // setStock({weight:stock.weight})
                        stock.weight.push(sub1.weight);
                        setStock({weight:[...stock.weight, stock.weight]});
                        setWeight(stock.weight);
    
                        // Object.assign(stock.name[index]=sub1.name)
                        // setStock({name:stock.name})
                        stock.name.push(sub1.name);
                        setStock({name:[...stock.name, stock.name]});
                        setSName(stock.name)
                        console.log(stock);
                    }
                    else{
                    //    console.log("Clicked");
                    }
                })
            }else if (sub.userType == 'Shop' && sub.isCancelled == false) {
                    sub.temp.map((sub1,index)=>{
                        if (sstock.name.indexOf(sub1.name) == 0) {
                                        Object.assign(sstock.quantity[index]+=sub.quantity)
                                        setSStock({quantity:sstock.quantity})
                                        setShopQuantity(sstock.quantity)
                            found = true;
                            // break;
                        }else if(sstock.name.indexOf(sub1.name) == -1){
                            sstock.quantity.push(sub1.quantity);
                            setSStock({quantity:[...sstock.quantity, sstock.quantity]});
                            // Object.assign(sstock.quantity[index]=sub.quantity)
                            // setSStock({quantity:sstock.quantity})
                            setShopQuantity(sstock.quantity)
        
                            // Object.assign(sstock.weight[index]=sub.weight)
                            // setSStock({weight:sstock.weight})
                            sstock.weight.push(sub1.weight);
                            setSStock({weight:[...sstock.weight, sstock.weight]});
                            setShopWeight(sstock.weight);
        
                            // Object.assign(sstock.name[index]=sub.name)
                            // setSStock({name:sstock.name})
                            sstock.name.push(sub1.name);
                            setSStock({name:[...sstock.name, sstock.name]});
                            setShopName(sstock.name)
                            console.log(sstock);
                        }
                        else{
                            //    console.log("Clicked");
                            }
                    })
            }else if (sub.userType == 'Hotel' && sub.isCancelled == false) {
                sub.temp.map((sub1,index)=>{
                    if (hstock.name.indexOf(sub1.name) == 0) {
                                    Object.assign(hstock.quantity[index]+=sub.quantity)
                                    setHStock({quantity:hstock.quantity})
                                    setHotelQuantity(hstock.quantity)
                        found = true;
                        // break;
                    }else if(hstock.name.indexOf(sub1.name) == -1){
                        // Object.assign(hstock.quantity[index]=sub.quantity)
                        // setHStock({quantity:hstock.quantity})
                        hstock.quantity.push(sub1.quantity);
                        setHStock({quantity:[...hstock.quantity, hstock.quantity]});
                        setHotelQuantity(hstock.quantity)
    
                        // Object.assign(hstock.weight[index]=sub.weight)
                        // setHStock({weight:hstock.weight})
                        hstock.weight.push(sub1.weight);
                        setHStock({weight:[...hstock.weight, hstock.weight]});
                        setHotelWeight(hstock.weight);
    
                        // Object.assign(hstock.name[index]=sub.name)
                        // setHStock({name:hstock.name})
                        hstock.name.push(sub1.name);
                        setHStock({name:[...hstock.name, stock.hname]});
                        setHotelName(hstock.name)
                        // console.log(hstock);
                    }
                    else{
                        //    console.log("Clicked");
                        }
                })
            }
        })
    }catch (error) {
            }
    
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
const onChangeDate =  (e) => {
    porder=new Date(document.getElementById("date-input").value).getTime();
    order=new Date(document.getElementById("date-input").value).getTime()- (24 * 60 * 60 * 1000);
    getUsers();
    setStock({
        name: ([]),
        quantity:([]),
        weight: ([]),
    })
    setSName([])
    setSQuantity([])
  };
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
  const exportPDF = () => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = "Stock Report";
    const headers = [["Product Name","Quantity"]];

    const data =sName.map((sub,index) =>{
        let text = weight[index]
        const myArray = text.split(" ");
        var temp=sQuantity[index]*myArray[0]
        return([sub,myArray[1] == "gms"? temp>=1000?(temp/1000)+"Kg" :temp+"gms" :myArray[1] == "ml"?temp>=1000?(temp/1000)+"Liters":temp+"ml":temp+myArray[1]])
    });
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
    doc.save("stockreport.pdf")
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
            <span className="font-xl">Tomorrow Stock Report</span>
            <span>
                <CInput type="date" id="date-input" name="date-input" placeholder="date" onChange={() => onChangeDate()}/>
            </span>
            <span>
              <CButton color="info" className="mr-3"
               onClick={()=>exportPDF()}
               >
                Export Data
              </CButton>
            </span>
          </CCardHeader>
          <CCardBody>
            <CTabs activeTab="home">
                <CNav variant="tabs">
                <CNavItem>
                    <CNavLink data-tab="home">
                    Society Order Report
                    </CNavLink>
                </CNavItem>
                {/* <CNavItem>
                    <CNavLink data-tab="profile">
                        Shop Order Report
                    </CNavLink>
                </CNavItem>
                <CNavItem>
                    <CNavLink data-tab="messages">
                        Hotel Order Report
                    </CNavLink>
                </CNavItem> */}
                </CNav>
                <CTabContent>
                <CTabPane data-tab="home">
                    <CRow>
                    <CCol md={4}>
                        <CDataTable
                            loading={loading}
                            onColumnFilterChange={(e) => {
                                setTableFilters(e);
                            }}
                            onSorterValueChange={(e) => {
                                console.log(e);
                            }}
                            onTableFilterChange={(filter) => setTableFilters(filter)}
                            items={sName}
                            fields={[
                                { key: "index", label:"Sr No", filter: false},
                                // { key: "ddate", label:"Order Date", filter: true},
                            //   { key: "id", label: "Order Id", filter: true},
                            //   { key: "type", label: "User Type", filter: true},
                            //   { key: "cname", label: "User Details", filter: true},
                                // { key: "details", label: "User Details", filter: true},
                            //   { key: "wing", label: "Wing", filter: true},
                            //   { key: "fno", label: "Flat No", filter: true},
                            //   { key: "socName",label:"Society Name", filter: true},
                                { key: "sName", label: "Society Order List", filter: false},
                                // { key: "quantity", label: "Shop Order List", filter: false },
                                // { key: "comment", label: "Hotel Order List", filter: true },
                            //   { key: "message", label: "Message", filter: true },
                                //  // { key: "mode", label: "Payment" , filter: true},
                            //   { key: "action", label: "Action" , filter: false},
                            ]}
                            scopedSlots={{
                                index: (item,index) => {
                                    return (
                                        <td>{index+1}
                                        </td>
                                    );
                                },
                            sName:(item,index)=>{
                                    let text = weight[index];
                                    const myArray = text.split(" ");
                                    var temp=sQuantity[index]*myArray[0]
                                    return(
                                        <td>
                                            {
                                            <div>{item} : {myArray[1] == "gms"? temp>=1000?(temp/1000)+"Kg" :temp+"gms" :myArray[1] == "ml"?temp>=1000?(temp/1000)+"Liters":temp+"ml":temp+myArray[1]}</div>
                                            }
                                        </td>
                                    );
                                },
                                quantity:(item)=>{
                                    
                                    return(
                                        <td>
                                            {
                                                shopName.map((sub,index)=>{
                                                    let text = shopWeight[index];
                                                    const myArray = text.split(" ");
                                                    var temp=shopQuantity[index]*myArray[0]
                                                    return(
                                                        <div>{sub} : {myArray[1] == "gms"? temp>=1000?(temp/1000)+"Kg" :temp+"gms" :myArray[1] == "ml"?temp>=1000?(temp/1000)+"Liters":temp+"ml":temp+myArray[1]}</div>

                                                    )
                                                })
                                            }
                                        </td>
                                    );
                                },
                                // amount: (item) => {
                                // return (
                                //     <td>
                                //         {/* {
                                //             item.payment.map(sub=>{
                                //                 return(<div>{sub.method} = <b>₹</b>{sub.amount}</div>)
                                //             }) 
                                //         }
                                //         <hr style={{width: "100%",marginLeft: "auto",marginRight: "auto",overflow: "hidden",border:"1px solid #333"}}/>
                                //         <div>Total = <b>₹</b>{item.amount}</div> */}
                                //     </td>
                                // );
                                // },
                              comment: (item) => {
                                
                                return (
                                  <td>
                                      {
                                          hotelName.map((sub,index)=>{
                                            let text = hotelWeight[index];
                                            const myArray = text.split(" ");
                                            var temp=hotelQuantity[index]*myArray[0]
                                            return(
                                                <div>{sub} : {myArray[1] == "gms"? temp>=1000?(temp/1000)+"Kg" :temp+"gms" :myArray[1] == "ml"?temp>=1000?(temp/1000)+"Liters":temp+"ml":temp+myArray[1]}</div>
                                                

                                            )
                                        })
                                      }
                                  </td>
                                );
                              },
                            //   message: (item) => {
                            //     return (
                            //       <td>
                            //           {item.message}
                            //       </td>
                            //     );
                            //   },
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
                            pagination
                            // itemsPerPageSelect
                            itemsPerPage={30}
                            clickableRows
                            // onRowClick={(item) =>view(item.id)}
                            
                            />
                        </CCol>
                        <CCol md={4}>
                        <CDataTable
                            loading={loading}
                            onColumnFilterChange={(e) => {
                                setTableFilters(e);
                            }}
                            onSorterValueChange={(e) => {
                                console.log(e);
                            }}
                            onTableFilterChange={(filter) => setTableFilters(filter)}
                            items={shopName}
                            fields={[
                                // { key: "index", label:"Sr No", filter: false},
                                // { key: "ddate", label:"Order Date", filter: true},
                            //   { key: "id", label: "Order Id", filter: true},
                            //   { key: "type", label: "User Type", filter: true},
                            //   { key: "cname", label: "User Details", filter: true},
                                // { key: "details", label: "User Details", filter: true},
                            //   { key: "wing", label: "Wing", filter: true},
                            //   { key: "fno", label: "Flat No", filter: true},
                            //   { key: "socName",label:"Society Name", filter: true},
                                // { key: "sName", label: "Society Order List", filter: false},
                                { key: "quantity", label: "Shop Order List", filter: false },
                                // { key: "comment", label: "Hotel Order List", filter: true },
                            //   { key: "message", label: "Message", filter: true },
                                //  // { key: "mode", label: "Payment" , filter: true},
                            //   { key: "action", label: "Action" , filter: false},
                            ]}
                            scopedSlots={{                
                                quantity:(item,index)=>{
                                let text = shopWeight[index];
                                const myArray = text.split(" ");
                                var temp=shopQuantity[index]*myArray[0]
                                    return(
                                        <td>
                                            {
                                                <div>{item} : {myArray[1] == "gms"? temp>=1000?(temp/1000)+"Kg" :temp+"gms" :myArray[1] == "ml"?temp>=1000?(temp/1000)+"Liters":temp+"ml":temp+myArray[1]}</div>

                                            }
                                        </td>
                                    );
                                }
                            }}
                            hover
                            striped
                            columnFilter
                            // tableFilter
                            sorter
                            pagination
                            // itemsPerPageSelect
                            itemsPerPage={30}
                            clickableRows
                            // onRowClick={(item) =>view(item.id)}
                            
                            />
                        </CCol>
                        <CCol md={4}>
                        <CDataTable
                            loading={loading}
                            onColumnFilterChange={(e) => {
                                setTableFilters(e);
                            }}
                            onSorterValueChange={(e) => {
                                console.log(e);
                            }}
                            onTableFilterChange={(filter) => setTableFilters(filter)}
                            items={hotelName}
                            fields={[
                                // { key: "index", label:"Sr No", filter: false},
                                // { key: "ddate", label:"Order Date", filter: true},
                            //   { key: "id", label: "Order Id", filter: true},
                            //   { key: "type", label: "User Type", filter: true},
                            //   { key: "cname", label: "User Details", filter: true},
                                // { key: "details", label: "User Details", filter: true},
                            //   { key: "wing", label: "Wing", filter: true},
                            //   { key: "fno", label: "Flat No", filter: true},
                            //   { key: "socName",label:"Society Name", filter: true},
                                // { key: "sName", label: "Society Order List", filter: false},
                                // { key: "quantity", label: "Shop Order List", filter: false },
                                { key: "comment", label: "Hotel Order List", filter: false},
                            //   { key: "message", label: "Message", filter: true },
                                //  // { key: "mode", label: "Payment" , filter: true},
                            //   { key: "action", label: "Action" , filter: false},
                            ]}
                            scopedSlots={{
                                
                                comment:(item,index)=>{
                                let text = hotelWeight[index];
                                const myArray = text.split(" ");
                                var temp=hotelQuantity[index]*myArray[0]
                                    return(
                                        <td>
                                            {
                                                <div>{item} : {myArray[1] == "gms"? temp>=1000?(temp/1000)+"Kg" :temp+"gms" :myArray[1] == "ml"?temp>=1000?(temp/1000)+"Liters":temp+"ml":temp+myArray[1]}</div>
                                            }
                                        </td>
                                    );
                                }
                            }}
                            hover
                            striped
                            columnFilter
                            // tableFilter
                            sorter
                            pagination
                            // itemsPerPageSelect
                            itemsPerPage={30}
                            clickableRows
                            // onRowClick={(item) =>view(item.id)}
                            
                            />
                        </CCol>
                        </CRow>
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
                            items={shopName}
                            fields={[
                                { key: "index", label:"Sr No", filter: false},
                                // { key: "ddate", label:"Order Date", filter: true},
                            //   { key: "id", label: "Order Id", filter: true},
                            //   { key: "type", label: "User Type", filter: true},
                            //   { key: "cname", label: "User Details", filter: true},
                                // { key: "details", label: "User Details", filter: true},
                            //   { key: "wing", label: "Wing", filter: true},
                            //   { key: "fno", label: "Flat No", filter: true},
                            //   { key: "socName",label:"Society Name", filter: true},
                                { key: "shopName", label: "Product Name", filter: false},
                                { key: "quantity", label: "Total Quantity", filter: false },
                            //   { key: "comment", label: "Comment", filter: true },
                            //   { key: "message", label: "Message", filter: true },
                                //  // { key: "mode", label: "Payment" , filter: true},
                            //   { key: "action", label: "Action" , filter: false},
                            ]}
                            scopedSlots={{
                                index: (item,index) => {
                                    return (
                                        <td>{index+1}
                                        </td>
                                    );
                                },
                                shopName:(item)=>{
                                    return(
                                        <td>
                                            {
                                            item
                                            }
                                        </td>
                                    );
                                },
                                quantity:(item,index)=>{
                                    let text = shopWeight[index];
                                    const myArray = text.split(" ");
                                    var temp=shopQuantity[index]*myArray[0]
                                    return(
                                        <td>
                                            {
                                            //    <div>{ myArray[1] == "gms"? temp>=1000?(temp/1000)+"Kg" :temp :myArray[1] == "ml"?temp>=1000?(temp/1000)+"Liters":temp:temp }</div>
                                            //   item.items.map((sub) => {
                                            //     let text = sub.weight;
                                            //     const myArray = text.split(" ");
                                            //     // myArray[1]
                                                
                                            //     return(
                                                    
                                            //         <div><div>{sub.name}</div><div>{sub.quantity}</div><div>{sub.weight}</div></div> 
                                            //     )
                                            //   })
                                            }
                                        </td>
                                    );
                                },
                            }}
                            hover
                            striped
                            columnFilter
                            // tableFilter
                            sorter
                            pagination
                            // itemsPerPageSelect
                            itemsPerPage={30}
                            clickableRows
                            // onRowClick={(item) =>view(item.id)}
                            
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
                            items={hotelName}
                            fields={[
                                { key: "index", label:"Sr No", filter: false},
                                // { key: "ddate", label:"Order Date", filter: true},
                            //   { key: "id", label: "Order Id", filter: true},
                            //   { key: "type", label: "User Type", filter: true},
                            //   { key: "cname", label: "User Details", filter: true},
                                // { key: "details", label: "User Details", filter: true},
                            //   { key: "wing", label: "Wing", filter: true},
                            //   { key: "fno", label: "Flat No", filter: true},
                            //   { key: "socName",label:"Society Name", filter: true},
                                { key: "hotelName", label: "Product Name", filter: false},
                                { key: "quantity", label: "Total Quantity", filter: false },
                            //   { key: "comment", label: "Comment", filter: true },
                            //   { key: "message", label: "Message", filter: true },
                                //  // { key: "mode", label: "Payment" , filter: true},
                            //   { key: "action", label: "Action" , filter: false},
                            ]}
                            scopedSlots={{
                                index: (item,index) => {
                                    return (
                                        <td>{index+1}
                                        </td>
                                    );
                                },
                                hotelName:(item)=>{
                                    return(
                                        <td>
                                            {
                                            item
                                            }
                                        </td>
                                    );
                                },
                                quantity:(item,index)=>{
                                    let text = hotelWeight[index];
                                    const myArray = text.split(" ");
                                    var temp=hotelQuantity[index]*myArray[0]
                                    return(
                                        <td>{
                                                <div>{myArray[1] == "gms"? temp>=1000?(temp/1000)+"Kg" :temp+"gms" :myArray[1] == "ml"?temp>=1000?(temp/1000)+"Liters":temp+"ml":temp+myArray[1]}</div>
                                            
                                            }
                                        </td>
                                    );
                                },
                            }}
                            hover
                            striped
                            columnFilter
                            // tableFilter
                            sorter
                            pagination
                            // itemsPerPageSelect
                            itemsPerPage={30}
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

export default StockReport;
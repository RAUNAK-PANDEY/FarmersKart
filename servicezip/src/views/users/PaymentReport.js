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
  CCol,
  CDataTable,
  CRow,
  CSpinner,
  CLabel,
  CInput,
  CDropdown,
  CDropdownToggle,
  CDropdownItem,
  CDropdownMenu,
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { exportDataToXLSX } from "../../utils/exportData";
import jsPDF from "jspdf";
import "jspdf-autotable";

const PaymentReport = () => {
  const history = useHistory();
//   var [cat, setCat] = useState([]);
  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [lastOrder, setLastOrder] = useState("");

  const socData = Date.now() - (7*(24 * 60 * 60 * 1000));
  const curData = Date.now();
  var[order, setOrder] = useState(socData);
  var[porder, setPorder] = useState(curData);
//   console.log(order);
//   console.log(new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(order));
  
  const [cat, setCat] = useState([]);
  // const [details, setDetails] = useState([]);
  var total = 0;
  var wtotal = 0;
  const [refresh, setRefresh] = React.useState(false);
  var [state, setState] = useState({
    videos: null,
  });

  useEffect(() => {
    getVideos();
  }, [refresh]);

  const getVideos = async () => {
    setLoading(true);
    const videos = await firebase.firestore().collection("orders").where("datePlaced", ">=", order).where("datePlaced", "<=", porder).get();

    let resolvedVideos = videos.docs.map((video) => {
      const id = video.id;
      const videoData = video.data();

      return {
        ...videoData,
        id: id,
        cid: videoData.customerId,
        cname: videoData.customerName,
        cemail: videoData.customerEmail,
        cphno: videoData.customerNumber,
        ddatePlaced: new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            }).format(videoData.datePlaced),
        datePlaced: videoData.datePlaced,
        ddatePicked: new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            }).format(videoData.datePicked),
        datePicked: videoData.datePicked,
        ddateDelivered: new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            }).format(videoData.dateDelivered),
        dateDelivered: videoData.dateDelivered,

        fno: videoData.flatNo,
        wing: videoData.wing,
        socName: videoData.societyName,
        userType:videoData.userType,

        isCancelled:videoData.isCancelled,
        status: videoData.orderStatus,
        amount: videoData.totalAmount,
        unpaidAmount: videoData.unpaidAmount,                
        payment: videoData.payment,      
        // packedBy: videoData.packedBy,
        method: videoData.payment.map((sub) => {
          return sub.method;
        }),
        unpaidStatus:videoData.unpaidStatus,
        paidUnpaidAmount:videoData.paidUnpaidAmount
      };
    });

    // resolvedVideos = resolvedVideos.sort(compare);
    // console.log(resolvedVideos);
    // resolvedVideos.map((item)=>{
    //     var temp =item.walletTotal;
    //     // var tem = 1*temp
    //     return (
    //         total+temp
    //     );
    // })
    setState({
      ...state,
      videos: resolvedVideos,
    });
    setCat(resolvedVideos);
    setLoading(false);
    // console.log(resolvedVideos);
  };

  const edit = (rowId) => {
    history.push(
      {
      pathname: '/wallet/add-points',
      state: rowId,
    //   index: index
      }
    )
  };
  const hist = (rowId) => {
    history.push(
      {
      pathname: '/wallet/user-history',
      state: rowId
      }
    )
  };
  const onExportData = async (e) => {
    state.videos= cat;
    const filteredData = state.videos
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
        // cname: videoData.customerName,
        // cemail: videoData.customerEmail,
        // cphno: videoData.customerNumber,
        // ddatePlaced: new Intl.DateTimeFormat("en-US", {
        //     year: "numeric",
        //     month: "2-digit",
        //     day: "2-digit",
        //     }).format(videoData.datePlaced),
        // datePlaced: videoData.datePlaced,
        // ddatePicked: new Intl.DateTimeFormat("en-US", {
        //         year: "numeric",
        //         month: "2-digit",
        //         day: "2-digit",
        //     }).format(videoData.datePicked),
        // datePicked: videoData.datePicked,
        // ddateDelivered: new Intl.DateTimeFormat("en-US", {
        //         year: "numeric",
        //         month: "2-digit",
        //         day: "2-digit",
        //     }).format(videoData.dateDelivered),
        // dateDelivered: videoData.dateDelivered,

        // fno: videoData.flatNo,
        // wing: videoData.wing,
        // socName: videoData.societyName,
        // userType:videoData.userType,

        // status: videoData.orderStatus,
        // amount: videoData.totalAmount,
        // unpaidAmount: videoData.unpaidAmount,                
        // // payment: videoData.payment,      
        // // packedBy: videoData.packedBy,
        // method: videoData.payment.map((sub) => {
        //   return sub.method;
        // }),
        name: item.cname,
        number: item.cphno,
        wing: item.wing,
        flatNo: item.fno,
        societyName: item.socName,
        status: item.status,
        amount: item.amount,
        unpaidAmount: item.unpaidAmount,
        method: item.payment,
        unpaidStatus:item.unpaidStatus,
        paidUnpaidAmount:item.paidUnpaidAmount,
        isCancelled:item.isCancelled
      })
      );

    // console.log(filteredData);
    exportPDF(filteredData);
    exportDataToXLSX(filteredData, "usersList");
  };
  const exportPDF = (e) => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = "Payment Report";
    // const cName = props.location.state.customerName
    const headers = [
      ["Customer Details","Wing","Flat No","Society Name","Order Status","Amount","Unpaid Amount","Payment Method","Paid Unpaid Amount"],
    ];

    const data = e.map((elt) => 
    [
      [elt.name + "\n" + elt.number],
      elt.wing,
      elt.flatNo,
      elt.societyName,
      elt.status,elt.amount,elt.unpaidAmount,
      elt.method.map((sub) =>{
        return(
            // [sub1.name,myArray[1] == "gms"? temp>=1000?(temp/1000)+"Kg" :temp+"gms" :myArray[1] == "ml"?temp>=1000?(temp/1000)+"Liters":temp+"ml":temp+myArray[1]]+"\n")
        [sub.method+ " = " + " Rs. " + sub.amount + "\n"]
        )
      }),
      elt.paidUnpaidAmount
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
    doc.save("paymentreport.pdf");
  };

  const updatedStatus = async (item,id,value) => {
    const updateddata = item.payment.map((temp,i) => temp.method=="COD"?
    Object.assign(temp,{["amount"]: 0}) : temp);
    // console.log(updateddata);
    if( value == "Follow Up"){
      await firebase.firestore().collection("orders").doc(id).update({
        unpaidStatus: value
      });
    }else{
        await firebase.firestore().collection("orders").doc(id).update({
            unpaidStatus: value,
            unpaidAmount:0,
            paidUnpaidAmount:item.unpaidAmount,
            payment:updateddata
          });
    }
    getVideos(); 
    history.push('/');
    history.replace("/payment-report");
    getVideos(); 
  };
  const deleteVideo = (item,id) => {
    // console.log(rowId);
    confirmAlert({
      title: "Upaid Amount Update:",
      message: (
        <CRow>
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
              <option value="COD">COD</option>
              <option value="Paid By GPay">Paid By GPay</option>
              <option value="Paid By Phone Pay">Paid By Phone Pay</option>
              <option value="Paid By Account Transfer">Paid By Account Transfer</option>
              <option value="Paid By Paytm">Paid By Paytm</option>
              <option value="Follow Up">Follow Up</option>
            </select>
          </CCol>
          {/* <CLabel style={{ marginLeft: "15px" }}>Amount :</CLabel>
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
          </div> */}
        </CRow>
      ),
 
      buttons: [
        {
          label: "Yes",
          onClick: async() => {
            var ref = document.getElementById("dropdown").value;
            const updateddata = item.payment.map((temp,i) => temp.method=="COD"?
            Object.assign(temp,{["amount"]: 0}) : temp);
            // console.log(updateddata);
            if( ref == "Follow Up"){
              await firebase.firestore().collection("orders").doc(id).update({
                unpaidStatus: document.getElementById("dropdown").value
              });
            }else{
                await firebase.firestore().collection("orders").doc(id).update({
                    unpaidStatus: document.getElementById("dropdown").value,
                    unpaidAmount:0,
                    paidUnpaidAmount:item.unpaidAmount,
                    payment:updateddata
                  });
            }
            getVideos(); 
            history.push('/');
            history.replace("/payment-report");
            getVideos(); 
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
  // const toggleDetails = (index) => {
  //   const position = details.indexOf(index);
  //   let newDetails = details.slice();
  //   if (position !== -1) {
  //     newDetails.splice(position, 1);
  //   } else {
  //     newDetails = [...details, index];
  //   }
  //   setDetails(newDetails);
  // };
  const onChangeDate =  (e) => {
    porder=new Date(document.getElementById("date-to").value).getTime();
    order=new Date(document.getElementById("date-from").value).getTime();
    getVideos();
  };

  return (
    <CRow>
      {/* <CCol xl={1} /> */}
      <CCol>
        <CCard>
        <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >
            <CRow>
                <CCol sm="4">
                    <div className="font-xl">Payment Report</div>
                </CCol>
                <CCol sm="1"></CCol>
                <CCol sm="2">
                    <div style={{width:"160px",marginLeft:"5px"}}>
                        From:
                        <span><CInput type="date" id="date-from" name="date-input" placeholder="date"/></span>
                    </div>
                </CCol>
                <CCol sm="2">
                    <div style={{width:"160px",marginLeft:"5px"}}>
                        To:
                        <span><CInput type="date" id="date-to" name="date-input" placeholder="date" onChange={() => onChangeDate()}/></span>   
                    </div>
                </CCol>
                <CCol sm="1"></CCol>
                <CCol sm="2">
                    <div>
                        <CButton color="info" className="mr-3"
                        onClick={() => onExportData()}
                        style={{ float:"right"}}
                        >
                            Export Data
                        </CButton>
                    </div>
                </CCol>
            </CRow>
        </CCardHeader>
          <CCardBody>
              <CRow>
                <CDataTable
                    loading={loading}
                    onColumnFilterChange={(e) => {
                      setTableFilters(e);
                    }}
                    onSorterValueChange={(e) => {
                      console.log(e);
                    }}
                    onTableFilterChange={(filter) => setTableFilters(filter)}
                    items={state.videos}
                    fields={[
                      { key: "wallet", label: "Wallet Amount", filter: false },
                      { key: "online", label: "Razor Pay(online)", filter: false },
                      { key: "cod", label: "COD", filter: false },
                      { key: "gpay", label: "Gpay", filter: false },
                      { key: "phonepay", label: "Phone Pay", filter: false },
                      { key: "paytm", label: "Paytm", filter: false },
                      { key: "bank", label: "Bank Transfer", filter: false },
                    ]}
                    scopedSlots={{
                        wallet: (item,index) => {
                            let wallet = 0;
                                cat.map((sub)=>{
                                    sub.payment.map((sub1)=>{
                                        if(sub1.method === "Wallet"){
                                            wallet = wallet + sub1.amount;
                                        }
                                    })
                                })
                            return (
                                index == 0?<td><b>₹</b>{wallet}</td>:
                            <td hidden>
                            </td>
                            );
                        },
                        online: (item,index) => {
                            let wallet = 0;
                                cat.map((sub)=>{
                                    sub.payment.map((sub1)=>{
                                        if(sub1.method === "Online"){
                                            wallet = wallet + sub1.amount;
                                        }
                                    })
                                })
                            return (
                                index == 0?<td><b>₹</b>{wallet}</td>:
                                <td hidden>
                                </td>
                            );
                        },
                        cod: (item,index) => {
                            let wtemp = 0;
                                cat.map((sub)=>{
                                    if(sub.unpaidStatus =="COD"){
                                        wtemp = wtemp + sub.paidUnpaidAmount;
                                        // console.log(wtemp);
                                    }
                                })
                            return (
                                index == 0?<td><b>₹</b>{wtemp}</td>:
                              <td hidden>
                                  {wtemp}
                              </td>
                            );
                        },
                        gpay: (item,index) => {
                            let wtemp = 0;
                                cat.map((sub)=>{
                                    if(sub.unpaidStatus =="Paid By GPay"){
                                        wtemp = wtemp + sub.paidUnpaidAmount;
                                        // console.log(wtemp);
                                    }
                                })
                            return (
                                index == 0?<td><b>₹</b>{wtemp}</td>:
                              <td hidden>
                                  {wtemp}
                              </td>
                            );
                        },
                        paytm: (item,index) => {
                            let wtemp = 0;
                                cat.map((sub)=>{
                                    if(sub.unpaidStatus =="Paid By Paytm"){
                                        wtemp = wtemp + sub.paidUnpaidAmount;
                                        // console.log(wtemp);
                                    }
                                })
                            return (
                                index == 0?<td><b>₹</b>{wtemp}</td>:
                              <td hidden>
                                  {wtemp}
                              </td>
                            );
                        },
                        phonepay: (item,index) => {
                            let wtemp = 0;
                                cat.map((sub)=>{
                                    if(sub.unpaidStatus =="Paid By Phone Pay"){
                                        wtemp = wtemp + sub.paidUnpaidAmount;
                                        // console.log(wtemp);
                                    }
                                })
                            return (
                                index == 0?<td><b>₹</b>{wtemp}</td>:
                              <td hidden>
                                  {wtemp}
                              </td>
                            );
                        },
                        bank: (item,index) => {
                            let wtemp = 0;
                                cat.map((sub)=>{
                                    if(sub.unpaidStatus =="Paid By Account Transfer"){
                                        wtemp = wtemp + sub.paidUnpaidAmount;
                                        // console.log(wtemp);
                                    }
                                })
                            return (
                                index == 0?<td><b>₹</b>{wtemp}</td>:
                              <td hidden>
                                  {wtemp}
                              </td>
                            );
                        },
                    }}
                    hover
                    striped
                    clickableRows
                />
              </CRow>
              <CRow>
                <CDataTable
                    loading={loading}
                    onColumnFilterChange={(e) => {
                      setTableFilters(e);
                    }}
                    onSorterValueChange={(e) => {
                      console.log(e);
                    }}
                    onTableFilterChange={(filter) => setTableFilters(filter)}
                    items={state.videos}
                    fields={[
                      { key: "ddatePlaced", label: "Order Date", filter: true },
                    //   { key: "ddatePicked", label: "Left For Delivery Date", filter: true },
                      { key: "ddateDelivered", label: "Order Delivered Date", filter: true },
                      { key: "id", label: "Order Id", filter: true },
                      { key: "userType", label: "User Type", filter: true },
                      { key: "cphno", label: "User Details", filter: true },
                      // { key: "details", label: "User Details", filter: true},
                      { key: "wing", label: "Wing", filter: true },
                      { key: "fno", label: "Flat No", filter: true },
                      { key: "socName", label: "Society Name", filter: true },
                      { key: "status", label: "Order Status", filter: true },
                      { key: "amount", label: "Total Amount", filter: true },
                      { key: "unpaidAmount", label: "Unpaid Amount", filter: true},

                      { key: "method", label: "Payment Details", filter: true },
                      //  // { key: "mode", label: "Payment" , filter: true},                      
                      { key: "unpaidStatus", label: "Unpaid Amount Action", filter: true },
                    ]}
                    scopedSlots={{
                        ddatePlaced: (item) => {
                        return (
                            item.isCancelled == true?<td hidden></td>:
                          <td>
                            <div>{item.ddatePlaced}</div>
                            <div>
                              {new Intl.DateTimeFormat("en-US", {hour: "numeric",minute: "numeric",}).format(item.datePlaced)}
                            </div>
                          </td>
                        );
                      },
                      ddatePicked: (item) => {
                        return (
                          <td>
                            <div>{item.ddatePicked}</div>
                            <div>
                              {new Intl.DateTimeFormat("en-US", {hour: "numeric",minute: "numeric",}).format(item.datePicked)}
                            </div>
                          </td>
                        );
                      },
                      ddateDelivered: (item) => {
                        return (
                        item.isCancelled == true?<td hidden></td>:
                          <td>
                            <div>{item.ddateDelivered}</div>
                            <div>
                              {new Intl.DateTimeFormat("en-US", {hour: "numeric",minute: "numeric",}).format(item.dateDelivered)}
                            </div>
                          </td>
                        );
                      },
                      id: (item) => {
                       return(
                        item.isCancelled == true?<td hidden></td>:
                        <td>{item.id.slice(0, 5)}</td>
                       )
                      },
                      userType: (item) => {
                        return (
                            item.isCancelled == true?<td hidden></td>:
                            <td>{item.userType}</td>
                        );
                       },
                      cphno: (item) => {
                        return (
                            item.isCancelled == true?<td hidden></td>:
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
                        return (
                            item.isCancelled == true?<td hidden></td>:
                            <td>{item.wing}</td>
                        );
                      },
                      fno: (item) => {
                        return (item.isCancelled == true?<td hidden></td>:<td>{item.fno}</td>);
                      },
                      socName: (item) => {
                        return (item.isCancelled == true?<td hidden></td>:<td>{item.socName}</td>);
                      },
                      status: (item) => {
                        return (item.isCancelled == true?<td hidden></td>:<td>{item.status}</td>);
                       },
                       amount: (item) => {
                        return (
                            item.isCancelled == true?<td hidden></td>:
                          <td>
                            <div><b>₹</b>{item.amount}</div>
                          </td>
                        );
                      },
                      unpaidAmount: (item) => {
                        return (
                            item.isCancelled == true?<td hidden></td>:
                          <td>
                            <div><b>₹</b>{item.unpaidAmount}</div>
                          </td>
                        );
                      },
                      method: (item) => {
                        return (
                            item.isCancelled == true?<td hidden></td>:
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
                          </td>
                        );
                      },
                      mode: (item) => {
                          
                        return (item.isCancelled == true?<td hidden></td>:<td>{item.mode}</td>);
                      },
                      unpaidStatus: (item, index) => {
                        var bool = false
                        item.payment.map((sub) => {
                            return (
                                sub.method == "Online"?bool=true:bool=false
                            );
                          })
                        if(bool != true){
                        return (
                            item.isCancelled == true?<td hidden></td>:
                          <td>
                                <div>
                                <CDropdown className="mt-2" style={{ border: "1px solid #d8dbe0", borderRadius:"0.25rem" }}>
                                    <CDropdownToggle
                                        caret
                                        varient={"outline"}
                                    >
                                        {item.unpaidStatus}
                                    </CDropdownToggle>
                                    <CDropdownMenu style={{ width: "100%"}}>
                                        <CDropdownItem header>Select Payment Mode</CDropdownItem>
                                        <CDropdownItem divider />
                                            <CDropdownItem onClick={() =>updatedStatus(item, item.id,"COD")}>COD</CDropdownItem>
                                            <CDropdownItem onClick={() =>updatedStatus(item, item.id,"Paid By GPay")}>Paid By GPay</CDropdownItem>
                                            <CDropdownItem onClick={() =>updatedStatus(item, item.id,"Paid By Phone Pay")}>Paid By Phone Pay</CDropdownItem>
                                            <CDropdownItem onClick={() =>updatedStatus(item, item.id,"Paid By Account Transfer")}>Paid By Account Transfer</CDropdownItem>
                                            <CDropdownItem onClick={() =>updatedStatus(item, item.id,"Paid By Paytm")}>Paid By Paytm</CDropdownItem>
                                            <CDropdownItem onClick={() =>updatedStatus(item, item.id,"Follow Up")}>Follow Up</CDropdownItem>
                                    </CDropdownMenu>
                                </CDropdown>
                                {/* <CButton
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
                                  {item.unpaidStatus}
                                </CButton> */}
                                </div>
                                <div><b>₹</b>{item.paidUnpaidAmount}</div>
                          </td>
                        );
                        }else{
                            return(
                            item.isCancelled == true?<td hidden></td>:<td></td>
                            );
                        }
                      },
                    }}
                    hover
                    striped
                    columnFilter
                    // tableFilter
                    sorter
                    // pagination
                    // itemsPerPageSelect
                    pagination
                    itemsPerPage={30}
                    clickableRows
                    // onRowClick={(item) =>view(item.id)}
                  />
            </CRow>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                marginBlock: 10,
              }}
            >
              {pageLoading ? (
                <CSpinner size="small" color="info" />
              ) : (
                <td hidden></td>
                // <CButton
                //   color="primary"
                //   disabled={pageLoading || loading}
                //   // variant="ghost"
                //   shape="square"
                //   size="sm"
                //   onClick={loadMoreOrders}
                // >
                //   Load More
                // </CButton>
              )}
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      {/* <CCol xl={1} /> */}
    </CRow>
  );
};

export default PaymentReport;

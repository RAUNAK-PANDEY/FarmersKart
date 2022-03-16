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
  CDataTable,
  CRow,
  CSpinner,
} from "@coreui/react";
import firebase from "../../config/fbconfig";

const Contact = () => {

  const history = useHistory();
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

  useEffect(() => {
    getVideos();
  }, [refresh]);

  const getVideos = async () => {
    setLoading(true);
    const videos = await firebase.firestore().collection("queries").get();
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
        complaint:videoData.communicationMethod,
        date:new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(videoData.date),
        timedate:videoData.date,
        query:videoData.query,
        name:videoData.userName,
        userId:videoData.userId,
       number:videoData.userNumber,
       ddate:new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(videoData.procesDate),
       date:videoData.procesDate,
       sdate:new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(videoData.solvedDate),
       solveddate:videoData.solvedDate,
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
  // const loadMoreOrders = async () => {
  //   setPageLoading(true);
  //   const videos = 
  //       await firebase.firestore().collection("users")
  //       .orderBy("date", "desc")
  //       .startAfter(lastOrder)
  //       .limit(50)
  //       .get();

  //   setLastOrder(videos.docs[videos.docs.length - 1]);
  //   let resolvedVideos = videos.docs.map((video) => {
  //       const id = video.id;
  //       const videoData = video.data();
  
  //       return {
  //         ...videoData,
  //         id: id,
  //         name: videoData.name,
  //         fno:videoData.flatNo,
  //         wing: videoData.wing,
  //         soc: videoData.societyName,
  //         // email: videoData.email,
  //         // username: videoData.username,
  //       };
  //     });
  
  //     resolvedVideos = resolvedVideos.sort(compare);
  //     console.log(resolvedVideos);

  
  //     setState({
  //       ...state,
  //       videos:[...state.videos, ...resolvedVideos],
  //     });
  //     console.log(videos);

  //   // const value = docs.filter((doc) => {
  //   //   if (
  //   //     !(
  //   //       doc.data().provider_id &&
  //   //       doc.data().customer_id &&
  //   //       doc.data().service &&
  //   //       doc.data().service["service_id"] &&
  //   //       doc.data().service["sub_service_id"]
  //   //     )
  //   //   ) {
  //   //     // console.log(doc.data());
  //   //   }
  //   //   return (
  //   //     doc.data().provider_id &&
  //   //     doc.data().customer_id &&
  //   //     doc.data().service &&
  //   //     doc.data().service["service_id"] &&
  //   //     doc.data().service["sub_service_id"]
  //   //   );
  //   // });

  //   // // resolving individual orders for meta field data
  //   // let processedOrders = await Promise.all(
  //   //   value.map(async (doc) => {
  //   //     const order = doc.data();
  //   //     const [
  //   //       resolvedProvider,
  //   //       resolvedService,
  //   //       resolvedCustomer,
  //   //       resolvedReferral,
  //   //     ] = await Promise.all([
  //   //       getProvider(order.provider_id),
  //   //       getService(order.service.service_id, order.service.sub_service_id),
  //   //       getUser(order.customer_id),
  //   //       // getUser(order.ref)
  //   //       getReferral(order.customer_id),
  //   //     ]);
  //   //     const supervisorsDocs = await firebase
  //   //       .firestore()
  //   //       .collection("supervisorJobs")
  //   //       .where("parent_TicketId", "==", order.ticketId || "")
  //   //       .get();
  //   //     const [resolvedSupervisor] = await Promise.all(
  //   //       supervisorsDocs.docs.map(async (doc) => {
  //   //         const provider = await firebase
  //   //           .firestore()
  //   //           .collection("providers")
  //   //           .doc(doc.data().provider)
  //   //           .get();
  //   //         return {
  //   //           supervisorName:
  //   //             provider.data()?.name ||
  //   //             provider.data()?.phone ||
  //   //             "Not Assigned",
  //   //         };
  //   //       })
  //   //     );
  //   //     setOrderMaker(resolvedCustomer);
  //   //     return {
  //   //       ...order,
  //   //       id: doc.id,
  //   //       provider_name: resolvedProvider.name
  //   //         ? resolvedProvider.name
  //   //         : resolvedProvider.phone,
  //   //       service_name: resolvedService.service.name,
  //   //       sub_service_name: resolvedService.sub_service.name,
  //   //       customer: resolvedCustomer.phone,
  //   //       payment_status: order.total
  //   //         ? order.amountPaid < order.total
  //   //           ? "pending"
  //   //           : "paid"
  //   //         : "pending",
  //   //       total_amount: order.total,
  //   //       referred_by: resolvedReferral,
  //   //       supervisorName: resolvedSupervisor?.supervisorName || "Not Assigned",
  //   //     };
  //   //   })
  //   // );

  //   // processedOrders = processedOrders.sort(compare);

  //   // setState({
  //   //   ...state,
  //   //   orders: [...state.orders, ...processedOrders],
  //   // });

  //   setPageLoading(false);
  // };
  const deleteVideo = (id) => {
    // console.log(rowId);
    confirmAlert({
      title: "Complaint Status",
      message: <CRow>
      <CCol sm={12}>
      <CLabel style={{ marginLeft: "15px"}} rows="3">Status :</CLabel>
      <select
       style={{ marginLeft: "21px",border: "1px solid #d8dbe0",borderRadius: "0.25rem",textAlign: "left"}}
       id="dropdown"
       >
        <option value="New">New</option>
        <option value="Process">Process</option>
        <option value="Solved">Solved</option>
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
            // Change(index);
            var ref = document.getElementById("dropdown").value;
            console.log(ref);
            if( ref == "Process"){
            await firebase.firestore().collection("queries").doc(id).update({
              status:document.getElementById("dropdown").value,
              procesDate:Date.now(),
              adminComment:document.getElementById("floatingTextarea").value,
            });
            }else if( ref == "Solved"){
              await firebase.firestore().collection("queries").doc(id).update({
                status:document.getElementById("dropdown").value,
                solvedDate:Date.now(),
                adminComment:document.getElementById("floatingTextarea").value,
              });
            }
           
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
            alert("Status Updated!");
            history.push('/');
            history.replace("/contact-us");
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
  const edit = (rowId,index) => {
    history.push(
      {
      pathname: '/blogs/edit-user',
      state: rowId,
      index: index
      }
    )
  };
  const hist = (rowId) => {
    history.push(
      {
      pathname: '/blogs/edit-user',
      state: rowId
      }
    )
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
        <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >Contact Us Section</CCardHeader>
          <CCardBody>
            <CDataTable style={{border:"1px solid #ebedf0"}}
              loading={loading}
              onTableFilterChange={(filter) => setTableFilters(filter)}
              items={state.videos}
              fields={[
                { key: "srno", label: "Sr. No.", filter: true },
                { key: "id", label: "Query Id", filter: true },
                { key: "date", label: "Date", filter: true },
                { key: "name", label: "User Details", filter: true },
                { key: "query", label:"Query",filter:true},
                { key: "complaint", label: "Communication Mode", filter: true },
                { key: "show_delete", label: "Status"},
                { key: "ddate", label: "Process Date",filter:true },
                { key: "sdate", label: "Solved Date",filter:true },
                { key: "adminComment", label: "Admin Comment",filter: true },
                // { key: "payment", label: "Payment Option",filter: true },
                // { key: "status" },
                // { key: "show_delete", label: "Order History" },
              ]}
              scopedSlots={{
                srno: (item, index) => {
                  return (
                    <td>
                        {index+1}
                    </td>
                  );
                },
                id: (item) => (
                  <td>
                    {item.id}
                  </td>
                ),
                date: (item) => (
                  <td>
                      <div>{new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(item.date)}</div>
                      {new Intl.DateTimeFormat('en-US', {hour: 'numeric', minute: 'numeric'}).format(item.date)}
                  </td>
                ),
                name: (item) => (
                  <td>
                    
                        <div>{item.name}</div>
                        <div>{item.number}</div>
                    
                  </td>
                ),
                  query: (item) => (
                    <td>
                        {
                            item.query
                        }
                    </td>
                  ),
                  complaint: (item) => (
                      <td>
                        {
                            item. complaint
                        }
                      </td>
                    ),
                    show_delete: (item,index) => {
                      return (
                        <td>
                          <CButton
                            size="sm"
                            className="ml-1"
                            style={{ color: "#fff",backgroundColor: "#007bff",borderColor: "#007bff", borderRadius:"0.25rem", marginRight:"5px" }}
                            onClick={() => deleteVideo(item.id)}
                          >
                            {item.status}
                          </CButton>
                        </td>
                      );
                    },
                    ddate: (item) => (
                      <td>
                        
                            <div>{item.ddate}</div>
                            <div>{new Intl.DateTimeFormat('en-US', {hour: 'numeric', minute: 'numeric'}).format(item.date)}</div>
                        
                      </td>
                    ),
                    sdate: (item) => (
                      <td>
                        <div>{item.sdate}</div>
                                <div>{new Intl.DateTimeFormat('en-US', {hour: 'numeric', minute: 'numeric'}).format(item.solveddate)}</div>
                      </td>
                    ),
                    complaint: (item) => (
                        <td>
                          {
                              item. complaint
                          }
                        </td>
                      ),
                // payment: (item) => (
                //     <td>
                //       {item.payment.map(sub=>{
                //             return(<div>{sub.method}</div>)
                //         })                      
                //       }
                //     </td>
                //   ),
                // link: (item) => (
                //   <td>
                //     {item.username}
                //   </td>
                // ),
                // show_delete: (item,index) => {
                //   return (
                //     <td>
                //       {/* <CButton
                //         size="sm"
                //         color="danger"
                //         className="ml-1"
                //         onClick={() => deleteVideo(item.id)}
                //       >
                //         Delete
                //       </CButton> */}
                //     </td>
                //   );
                // },
                //   details: (item) => {
                //     console.log(item);
                //     return (
                //       <CCollapse visible="true">
                //         <CCardBody>
                //           <h4>Description</h4>
                //           <p className="text-muted">{item.descriptioin}</p>
                //           <CButton size="sm" color="info">
                //             User Settings
                //           </CButton>
                //           <CButton size="sm" color="danger" className="ml-1">
                //             Delete
                //           </CButton>
                //         </CCardBody>
                //       </CCollapse>
                //     );
                //   },
              }}
              hover
              striped
              columnFilter
              pagination
              // tableFilter
              sorter
              // itemsPerPageSelect
              itemsPerPage={50}
              clickableRows
              //   onRowClick={(item) => history.push(`/users/${item.id}`)}
            />
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

export default Contact;

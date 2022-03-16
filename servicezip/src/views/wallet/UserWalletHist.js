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
  CCol,
  CDataTable,
  CRow,
  CSpinner,
} from "@coreui/react";
import firebase from "../../config/fbconfig";

const UserWalletHist = (props) => {

    console.log(props.location.state);
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
    const videos = await firebase.firestore().collection("users").doc(props.location.state.id).collection("wallet").get();
    // setLastOrder(videos.docs[videos.docs.length - 1]);
    // setLastOrder([videos.docs.length-1]);
    console.log(videos.docs.length);
    // console.log(lastOrder);

    let resolvedVideos = videos.docs.map((video) => {
      const id = video.id;
      const videoData = video.data();

      return {
        ...videoData,
        id: id,
        amount:videoData.amount,
        date:videoData.date,
        type:videoData.type,
        message:videoData.message
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
  const deleteVideo = (rowId) => {
    confirmAlert({
      title: "Delete",
      message: "Are you sure to Delete ?",
      buttons: [
        {
          label: "Yes",
          onClick: async() => {
            await firebase.firestore().collection("employee").doc(rowId).delete();
            setRefresh(!refresh);
                alert("Employee Deleted");
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
        <CCard className="mb-3" style={{ maxWidth: '540px',marginLeft:"18px" }}>
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
                </CCardBody>
                </CCol>
            </CRow>
        </CCard> 
      {/* <CCol xl={1} /> */}
      <CCol lg={12}>
        <CCard>
        <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >User Wallet History</CCardHeader>
          <CCardBody>
            <CDataTable style={{border:"1px solid #ebedf0"}}
              loading={loading}
              onTableFilterChange={(filter) => setTableFilters(filter)}
              items={state.videos}
              fields={[
                { key: "srno", label: "Sr. No.", filter: true },
                { key: "id", label: "Transaction Id", filter: true },
                { key: "date", label: "Transaction Date", filter: true },
                { key: "message", label: "Transaction Message", filter: true },
                { key: "type", label: "Transaction Type", filter: true },
                // { key: "weight", label: "[Quantity , Weight , Unit Price]", filter: true },
                { key: "amount", label:"Total Amount",filter:true},
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
                message: (item) => (
                  <td>
                    {
                        item.message
                    }
                  </td>
                ),
                type: (item) => (
                  <td>
                    {
                        item.type
                    }
                  </td>
                ),
                // oitems: (item) => (
                //   <td>
                //     {
                //         item.items.map(sub=>{
                //             return(<div>{sub.name}</div>)
                //         })
                //     }
                //   </td>
                // ),
                amount: (item) => (
                    <td>
                        <div><b>₹</b>{item.amount}</div>
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

export default UserWalletHist;

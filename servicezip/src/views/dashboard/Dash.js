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
  CCardImg,
  CCardText,
  CCardTitle
} from "@coreui/react";
import firebase from "../../config/fbconfig";

const Dash = () => {
  const history = useHistory();

  const socData = Date.now() - (24 * 60 * 60 * 1000);
  const curData = Date.now();
  var[order, setOrder] = useState(socData);
  var[porder, setPorder] = useState(curData);

  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [today, setToday] = useState("");
  const [total, setTotal] = useState("");
  var [collection, setCollection] = useState(0);
  const [rorder, setRorder] = useState("");
  const [cat, setCat] = useState([]);
  var count=0;
  // const [details, setDetails] = useState([]);
  const [refresh, setRefresh] = React.useState(false);
  var [state, setState] = useState({
    videos: null,
  });

  useEffect(() => {
    getVideos();
    getOrders();
    getROrders();
    getDeliverorder(); 
  }, [refresh]);

  const getVideos = async () => {
    setLoading(true);
    const videos = await firebase.firestore().collection("orders").where("orderStatus", "==", "placed").get();
    setToday(videos.docs.length)
    setLoading(false);
  };
  const getOrders = async () => {
    setLoading(true);
    const videos = await firebase.firestore().collection("orders").where("isCancelled", "==", false).get();
    setTotal(videos.docs.length)
    setLoading(false);
  };
  const getROrders = async () => {
    setLoading(true);
    const videos = await firebase.firestore().collection("orders").where("isCancelled", "==", true).get();
    setRorder(videos.docs.length)
    setLoading(false);
  };
  const getDeliverorder = async () => {
    setLoading(true);
    const users = await firebase
      .firestore()
      .collection("orders")
      .where("datePlaced", ">=", order).where("datePlaced", "<=", porder)
      .get();
    // setDorder(users.docs.length);

    const resolvedUsers = users.docs.map((user) => {
      const id = user.id;
      const userData = user.data();

      return {
        ...userData,
        id: id,
        amount:userData.payment
      };
    });
    setState({
      ...state,
      videos: resolvedUsers,
    });
    setCat(resolvedUsers)
    setLoading(false);
    // console.log(users.date);
  };

  const deleteVideo = (rowId) => {
    console.log(rowId);
    confirmAlert({
      title: "Delete",
      message: "Are you sure to Delete ?",
      buttons: [
        {
          label: "Yes",
          onClick: async() => {
            // await firebase.firestore().collection("categories").doc(rowId).delete();
            await firebase.firestore().collection("categories").doc(rowId).update({
              subCategory : []
          })
          try{
            await firebase.firestore().collection("products").where("category","==",rowId).update({
              subCategory:"",
            });
          }catch (error) {
          }
            alert("Sub Category Deleted");
            history.push('/');
            history.replace("/videos/sub-category");
            // getVideos();

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
  const edit = async(rowId) => {
    history.push(
      {
      pathname: '/videos/edit-subcategory',
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
      {/* <CCol xl={1} /> */}
      <CCol>

          <CRow>
              <CCol md="4"sm="6">
                    <CCard className="mb-3" style={{ maxWidth: '540px'}}>
                        <CRow className="g-0">
                            <CCol md={4}>
                            <CCardImg  src={"avatars/order.png"}/>
                            </CCol>
                            <CCol md={8}>
                            <CCardBody>
                                <CCardTitle>Today's Orders - {today}</CCardTitle>
                                <CCardTitle>Total Order - {total}</CCardTitle>
                            </CCardBody>
                            </CCol>
                        </CRow>
                    </CCard>
              </CCol>
              <CCol md="4"sm="6">
                    <CCard className="mb-3" style={{ maxWidth: '540px'}}>
                        <CRow className="g-0">
                            <CCol md={4}>
                            <CCardImg src={"avatars/collection.png"}/>
                            </CCol>
                            <CCol md={8}>
                            <CCardBody>
                                <CCardTitle>Today's Collection - {collection}</CCardTitle>
                            </CCardBody>
                            </CCol>
                        </CRow>
                    </CCard>
              </CCol>
            <CCol md="4"sm="6">
                    <CCard className="mb-3" style={{ maxWidth: '540px'}}>
                        <CRow className="g-0">
                            <CCol md={4}>
                            <CCardImg src={"avatars/rejected.png"}/>
                            </CCol>
                            <CCol md={8}>
                            <CCardBody>
                                <CCardTitle>Order Rejected - {rorder}</CCardTitle>
                            </CCardBody>
                            </CCol>
                        </CRow>
                    </CCard>
              </CCol>
          </CRow>
          <CRow>
                <CCard className="mb-3" style={{width:"100%"}}>
                    <CRow className="g-0">
                        <CCol md={4}>
                        <CCardImg src={"avatars/analytics.png"}/>
                        </CCol>
                        <CCol md={8}>
                        <CCardBody style={{alignItems:"center"}}>
                            <CCardTitle style={{color:"#DC3545",  alignItems:"center"}}><h1>Google Analytics</h1></CCardTitle>
                            {/* <CCardText>
                            This is a wider card with supporting text below as a natural lead-in to additional
                            content. This content is a little bit longer.
                            </CCardText>
                            <CCardText>
                            <small className="text-medium-emphasis">Last updated 3 mins ago</small>
                            </CCardText> */}
                        </CCardBody>
                        </CCol>
                    </CRow>
                </CCard>
          </CRow>
      </CCol>

      {/* <CCol xl={1} /> */}
    </CRow>
  );
};

export default Dash;

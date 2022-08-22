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
  CSpinner
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { exportDataToXLSX } from "../../utils/exportData";
import jsPDF from "jspdf";
import "jspdf-autotable";
const UserOrderHist = () => {
  const history = useHistory();
  var [cat, setCat] = useState([]);
  var [tempData, setTempData] = useState([]);
  var [dat, setDat] = useState([]);
  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [lastOrder, setLastOrder] = useState("");
  // const [details, setDetails] = useState([]);
  const [refresh, setRefresh] = React.useState(false);
  var [state, setState] = useState({
    videos: null,
  });

  useEffect(() => {;
    getOrders();
  }, [refresh]);
  
  const getOrders = async () => {
    setLoading(true);
    const response = await firebase.firestore().collection("orders").orderBy("datePlaced","asc");
    const data = await response.get();

    let resolvedVideos = data.docs.map((video) => {
      const id = video.id;
      const videoData = video.data();

      return {
        ...videoData,
        id: id,
        customerId: videoData.customerId,
        // email: videoData.email,
        // username: videoData.username,
      };
    });
    const user = await firebase.firestore().collection("users").orderBy("name");
    const udata = await user.get();
    udata.docs.map((sub)=>{
      let count = 0;
      resolvedVideos.map((subData)=>{
        // console.log(sub.id);
        // console.log(subData.customerId);
        if (sub.id == subData.customerId) {
          count++
        }
      })
      cat.push({ id: sub.id,orderCount:count, ...sub.data() });
    })
    // data.docs.forEach((item) => {
    //   cat.push({ id: item.id, ...item.data() });
    // });
    setCat([...cat, cat]);
    setLoading(false);
    // console.log(cat);
  };
  const getVideos = async () => {
    setLoading(true);
    const videos = await firebase.firestore().collection("users").orderBy("name").get();
    setLastOrder(videos.docs[videos.docs.length - 1]);
    // setLastOrder([videos.docs.length-1]);
    // console.log(videos.docs.length);
    // console.log(lastOrder);

    let resolvedVideos = videos.docs.map((video) => {
      const id = video.id;
      const videoData = video.data();

      return {
        ...videoData,
        id: id,
        name: videoData.name,
        phno:videoData.mobile,
        fno:videoData.flatNo,
        wing: videoData.wing,
        soc: videoData.societyName,
        type:videoData.userType
        // email: videoData.email,
        // username: videoData.username,
      };
    });

    // resolvedVideos = resolvedVideos.sort(compare);
    // console.log(resolvedVideos);

    setState({
      ...state,
      videos: resolvedVideos,
    });
    setDat(resolvedVideos);
    setLoading(false);
    // console.log(videos);
  };


  const onExportData = async (e) => {

    const filteredData = cat
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
    
        name: item.name,
        phno:item.mobile,
        flatNo:item.flatNo,
        societyName: item.societyName,
        wing: item.wing,
        type:item.userType,
        orderCount:item.orderCount
        
      })
      );
    // exportPDF(filteredData);
    exportDataToXLSX(filteredData, "usersList");
  };
  const exportPDF = (e) => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = "User Order History";
    // const cName = props.location.state.customerName
    const headers = [
      ["Customer Details","Phone No","Flat No","Society Name","wing","User Type"],
    ];

    const data = e.map((elt) => 
    [
      elt.name  ,
      elt.number,
      elt.flatNo,
      elt.societyName,
      elt.wing,
      elt.userType,
      
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
    doc.save("userOrderHistory.pdf");
  };
  const deleteVideo = (rowId) => {
    confirmAlert({
      title: "Delete",
      message: "Are you sure to Delete ?",
      buttons: [
        {
          label: "Yes",
          onClick: async() => {
            await firebase.firestore().collection("users").doc(rowId).delete();
            setRefresh(!refresh);
                alert("User Deleted");
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
      pathname: '/blogs/user-history',
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
        <CCard>
        <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} ><CRow>
                <CCol sm="4">
                    <div className="font-xl">User Order History</div>
                </CCol>
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
            <CDataTable style={{border:"1px solid #ebedf0"}}
              loading={loading}
              onColumnFilterChange={(e) => {
                setTableFilters(e);
              }}
              onSorterValueChange={(e) => {
                console.log(e);
              }}
              onTableFilterChange={(filter) => setTableFilters(filter)}
              items={cat}
              fields={[
                { key: "srno", label: "Sr. No.", filter: true },
                { key: "userType", label: "User Type", filter: true },
                // { key: "dd1", label: "First order Date", filter:true},
                { key: "orderCount", label: "Total No Of Orders", filter:true},
                { key: "name", label: "Username", filter: true },
                { key: "mobile", label: "Phone Number", filter: true },
                { key: "flatNo", label: "Flat No", filter: true },
                { key: "wing", label: "Wing", filter: true },
                { key: "societyName", label: "Society", filter: true },
                // { key: "image", label:"Category Image" },
                // { key: "link", label: "Username",filter: true },
                // { key: "status" },
                { key: "show_delete", label: "Order History" },
              ]}
              scopedSlots={{
                srno: (item, index) => {
                  return (
                    <td>
                        {index+1}
                    </td>
                  );
                },
                userType: (item) => (
                  <td>
                    {item.userType}
                  </td>
                ),
                orderCount: (item) => {
                return (
                  <td>{item.orderCount}</td>
                );
                },
                name: (item) => (
                  <td>
                    <div>{item.name}</div>
                    <div>{item.mobile}</div>
                    {/* <div>{item.id}</div> */}
                  </td>
                ),
                mobile: (item) => (
                  <td>
                    <div>{item.mobile}</div>
                  </td>
                ),
                flatNo: (item) => (
                  <td>
                    {item.flatNo}
                  </td>
                ),
                wing: (item) => (
                  <td>
                    {item.wing}
                  </td>
                ),
                societyName: (item) => (
                  <td>
                    {item.societyName}
                  </td>
                ),
                show_delete: (item,index) => {
                  return (
                    <td>
                      <CInputGroup style={{flexWrap: "nowrap"}}>
                              <CButton style={{ color: "#fff",backgroundColor: "#007bff",borderColor: "#007bff", borderRadius:"0.25rem", marginRight:"5px" }} type="button" color="secondary" variant="outline" onClick={() => hist(item)}>View History</CButton>
                              <CButton style={{ color: "#fff",backgroundColor: "#00BFFF",borderColor: "#00BFFF", borderRadius:"0.25rem" }} type="button" color="secondary" variant="outline" onClick={() => edit(item,index)}>Update User</CButton>
                              
                           </CInputGroup>
                    </td>
                  );
                },
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

export default UserOrderHist;

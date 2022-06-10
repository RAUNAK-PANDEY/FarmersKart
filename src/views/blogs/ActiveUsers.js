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
const ActiveUsers = () => {
  const history = useHistory();
  const socData = Date.now() - (15*(24 * 60 * 60 * 1000));
  const curData = Date.now();
  var[order, setOrder] = useState(socData);
  var[porder, setPorder] = useState(curData);

  var [cat, setCat] = useState([]);
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

  useEffect(() => {
    // getVideos();
    getOrders();
  }, [refresh]);

  // function compare(b, a) {
  //   var id = "id";
  //   if (a[id] < b[id]) {
  //     return -1;
  //   }
  //   if (a[id] > b[id]) {
  //     return 1;
  //   }
  //   return 0;
  // }
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
  const getOrders = async () => {
  const response =   await firebase.firestore().collection("orders").where("datePlaced", ">=", order).where("datePlaced", "<=", porder).get();
  response.docs.forEach((item) => {
    let obj = cat.find(o => o.customerId === item.data().customerId);
    if(!obj){
    cat.push({ id: item.id, ...item.data() });}
  });
  setCat([...cat, cat]);
  // console.log(cat);
};
console.log(cat)   
   
const onExportData = async (e) => {
  state.videos= dat;
  
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
  
      name: item.name,
      phno:item.phno,
      fno:item.fno,
      soc: item.soc,
      wing: item.wing,
      type:item.type,
      
    })
    );

  // console.log(filteredData);
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

  

  return (
    <CRow>
      {/* <CCol xl={1} /> */}
      <CCol>
        <CCard>
        <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} ><CRow>
                <CCol sm="4">
                    <div className="font-xl">Active Users</div>
                </CCol>
                {/* <CCol sm="2">
                    <div>
                        <CButton color="info" className="mr-3"
                        onClick={() => onExportData()}
                        style={{ float:"right"}}
                        >
                            Export Data
                        </CButton>
                    </div>
                </CCol> */}
            </CRow>
                
                </CCardHeader>
          <CCardBody>
            <CDataTable style={{border:"1px solid #ebedf0"}}
              loading={loading}
              onTableFilterChange={(filter) => setTableFilters(filter)}
              items={cat}
              fields={[
                { key: "srno", label: "Sr. No.", filter: true },
                { key: "customerName", label: "customer Name", filter: true },
                { key: "customerNumber", label: "customer Number", filter:true},
                { key: "flatNo", label: "flat No", filter: true },
                { key: "societyName", label: "society Name", filter: true },
                 
                { key: "wing", label: "Wing", filter: true },
                { key: "userType", label: "user Type", filter: true },
                 
              ]}
              scopedSlots={{
                srno: (item, index) => {
                  return (
                    <td>
                        {index+1}
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

export default ActiveUsers;

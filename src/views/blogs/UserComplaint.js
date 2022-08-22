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

const UserComplaint = (props) => {

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
    const videos = await firebase.firestore().collection("complaints").orderBy("date","desc").get();

    let resolvedVideos = videos.docs.map((video) => {
      const id = video.id;
      const videoData = video.data();

      return {
        ...videoData,
        id: id,
        complaint:videoData.complaint,
        date:new Intl.DateTimeFormat(['ban', 'id'], {year: 'numeric', month: '2-digit',day: '2-digit'}).format(videoData.date),
        timedate:videoData.date,
        // date:videoData.date,
        imageUrl:videoData.imageUrl,
        name:videoData.name,
        subject:videoData.subject,
        userId:videoData.userId,
        userName:videoData.customerName,
        userNumber:videoData.customerNumber,
        userEmail:videoData.customerEmail,
        userSociety:videoData.societyName,
        status:videoData.status,
        ddate:new Intl.DateTimeFormat(['ban', 'id'], {year: 'numeric', month: '2-digit',day: '2-digit'}).format(videoData.procesDate),
        pdate:videoData.procesDate,
        sdate:new Intl.DateTimeFormat(['ban', 'id'], {year: 'numeric', month: '2-digit',day: '2-digit'}).format(videoData.solvedDate),
        solveddate:videoData.solvedDate,
        wing:videoData.wing,
        flatNo:videoData.flat,
        // solvedDate:,
        adminComment:videoData.adminComment,

      };
    });
    setState({
      ...state,
      videos: resolvedVideos,
    });
    setLoading(false);
    // console.log(videos);
  };

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
            // console.log(ref);
            if( ref == "Process"){
            await firebase.firestore().collection("complaints").doc(id).update({
              status:document.getElementById("dropdown").value,
              procesDate:Date.now(),
              adminComment:document.getElementById("floatingTextarea").value,
            });
            }else if( ref == "Solved"){
              await firebase.firestore().collection("complaints").doc(id).update({
                status:document.getElementById("dropdown").value,
                solvedDate:Date.now(),
                adminComment:document.getElementById("floatingTextarea").value,
                isActive:false,
              });
            }
            history.push('/');
            history.replace("/blogs/user-complaint");

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
  const remove = (rowId) => {
    confirmAlert({
      title: "Delete Complaint",
      message: "Are you sure to Delete the complaints?",
      buttons: [
        {
          label: "Yes",
          onClick: async() => {
            await firebase.firestore().collection("complaints").doc(rowId).delete();
            getVideos()
            // firebase
            //   .storage()
            //   .ref()
            //   .child("providers/" + match.params.id + "/verification_document")
            //   .delete()
            //   .then((url) => {
            //     console.log(url);
                alert("Complaint Deleted");
                setRefresh(!refresh);
            //   });
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
  return (
    <CRow>
      <CCol lg={12}>
        <CCard>
        <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >User Complaint Section</CCardHeader>
          <CCardBody>
            <CDataTable style={{border:"1px solid #ebedf0"}}
              loading={loading}
              onTableFilterChange={(filter) => setTableFilters(filter)}
              items={state.videos}
              fields={[
                { key: "srno", label: "Sr. No.", filter: true },
                { key: "id", label: "Complaint Id", filter: true },
                { key: "date", label: "Date", filter: true },
                { key: "userName", label: "User Name", filter: true },
                { key: "userNumber", label: "User Number", filter: true },
                { key: "wing", label: "Wing", filter: true },
                { key: "flatNo", label: "Flat No", filter: true },
                { key: "userSociety", label: "User Address", filter: true },
                { key: "subject", label: "Subject", filter: true },
                { key: "complaint", label: "Complaint", filter: true },
                { key: "imageUrl", label:"Image",filter:true},
   
                // { key: "status" },
                { key: "status", label: "Status",filter:true},
                // { key: "ddate", label: "Process Date",filter:true },
                { key: "sdate", label: "Solved Date",filter:true },
                { key: "adminComment", label: "Admin Comment",filter: true },
                { key: "action", label: " Action", filter: false },
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
                      <div>{item.date}</div>
                      <div>{new Intl.DateTimeFormat('en-US', {hour: 'numeric', minute: 'numeric'}).format(item.timedate)}</div>
                  </td>
                ),
                userSociety: (item) => (
                  <td>
                    {
                        item.userName
                    }
                  </td>
                ),
                userNumber: (item) => (
                  <td>
                    {
                        <div>
                          {/* <div>{item.userName}</div> */}
                          <div>{item.userNumber}</div>
                          <div>{item.userEmail}</div>
                        </div>
                    }
                  </td>
                ),
                wing: (item) => (
                  <td>
                    <div>{item.wing}</div>
                  </td>
                ),
                flatNo: (item) => (
                  <td>
                    <div>{item.flatNo}</div>
                  </td>
                ),
                userSociety: (item) => (
                  <td>
                    {
                        item.userSociety
                    }
                  </td>
                ),
                subject: (item) => (
                  <td>
                    {
                        item.subject
                    }
                  </td>
                ),
                ddate: (item) => (
                  <td>
                    
                        <div>{item.ddate}</div>
                        <div>{new Intl.DateTimeFormat('en-US', {hour: 'numeric', minute: 'numeric'}).format(item.pdate)}</div>
                    
                  </td>
                ),
                // sdate: (item) => (
                //   <td>
                //     <div>{item.sdate}</div>
                //             <div>{new Intl.DateTimeFormat('en-US', {hour: 'numeric', minute: 'numeric'}).format(item.solveddate)}</div>
                //   </td>
                // ),
                complaint: (item) => (
                    <td>
                      {
                          item. complaint
                      }
                    </td>
                  ),
                  imageUrl: (item) => (
                    <td>
                        <CImg
                        // key={index}
                        rounded="true"
                        src={item.imageUrl}
                        width={160}
                        height={200}
                        />
                    </td>
                  ),
                status: (item,index) => {
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
                adminComment: (item) => (
                    <td>
                      {item.adminComment}
                    </td>
                  ),
                  action: (item, index) => {
                  return (
                    <td style={{border:"1px solid #dee2e6", backgroundColor: "#ffffff"}}>
                        {
                           <CInputGroup style={{flexWrap: "nowrap"}}>
                              
                              <CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545", borderRadius:"0.25rem" }} type="button" color="secondary" variant="outline" onClick={()=>remove(item.id)}>Delete</CButton>
                           </CInputGroup>
                        }
                    </td>
                  );
                },
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
    </CRow>
  );
};

export default UserComplaint;

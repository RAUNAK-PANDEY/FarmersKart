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
  CLabel
} from "@coreui/react";
import firebase from "../../config/fbconfig";

const BlogsPage = () => {
  const history = useHistory();
  var [cat, setCat] = useState([]);
  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
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
    const videos = await firebase.firestore().collection("employee").get();
    // console.log(videos.docs.length).;

    const resolvedVideos = videos.docs.map((video) => {
      const id = video.id;
      const videoData = video.data();

      return {
        ...videoData,
        id: id,
        fName: videoData.fName,
        lName:videoData.lName,
        role: videoData.role,
        mobileNo: videoData.mobileNo,
        email: videoData.email,
        userName: videoData.userName,
        baseSalary:videoData.baseSalary,
      };
    });

    // console.log(resolvedVideos);

    setState({
      ...state,
      videos: resolvedVideos,
    });
    setLoading(false);
    // console.log(videos);
  };
//   const getUnits = () =>{
//     cat.filter(x => x.id === 'data').map( sub =>{
//         return( 
          
//         )
//       })
//       console.log(cat);
//   }
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

  var [ref, setRef] = useState();
  const handleChange = (e) => {
    setRef(e.target.value)
  }
  const addSalary = (item, rowId) => {
    // console.log(item);
    confirmAlert({
      title: "Salary",
      message: (
        <CRow>
          <CCol sm={12}>
            <CLabel style={{ marginLeft: "15px" }} rows="3">
              Credit/Debit :
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
              <option value="Credit">Credit</option>
              <option value="Debit">Debit</option>
            </select>
          </CCol>
          {/* <CCol sm={12}>
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
          </CCol> */}
          <CLabel style={{ marginLeft: "15px" }}>Amount :</CLabel>
          <br></br>
          <div
            class="form-floating"
            style={{ marginLeft: "15px", color: "#333" }}
            rows="3"
          >
            <input 
              type="number"
              placeholder="Enter Amount"
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
            var ref =document.getElementById("status").value;
            await firebase
              .firestore()
              .collection("employee")
              .doc(rowId)
              .collection("salary")
              .add({
                date:Date.now(),
                amount: document.getElementById("floatingTextarea").value,
                type: document.getElementById("status").value,
              });
              ref=="Credit"?alert("Amount Credited Successfully!"):alert("Amount Debited Successfully!")
            // getUsers();
            // getPostorder();
            // getLorder();
            // getDeliverorder();
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
      pathname: '/blogs/edit-employee',
      state: rowId,
      index: index
      }
    )
  };
  const hist = (rowId,index) => {
    history.push(
      {
      pathname: '/blogs/view-employee-history',
      state: rowId,
      index: index
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
        <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >Employee List</CCardHeader>
          <CCardBody>
            <CDataTable style={{border:"1px solid #ebedf0"}}
              loading={loading}
              onTableFilterChange={(filter) => setTableFilters(filter)}
              items={state.videos}
              fields={[
                { key: "srno", label: "Sr. No.", filter: true },
                { key: "role", label: "Role", filter: true },
                { key: "fname", label: "Name", filter: true },
                { key: "mobileNo", label: "Mobile", filter: true },
                { key: "email", label: "Email-Id", filter: true },
                // { key: "image", label:"Category Image" },
                { key: "userName", label: "Username",filter: true },
                { key: "baseSalary", label: "Salary",filter: true },
                // { key: "status" },
                { key: "show_delete", label: "Action" },
              ]}
              scopedSlots={{
                srno: (item, index) => {
                  return (
                    <td>
                        {index+1}
                    </td>
                  );
                },
                role: (item) => (
                  <td>
                    {item.role}
                  </td>
                ),
                fname: (item) => (
                  <td>
                    {item.fName+item.lName}
                  </td>
                ),
                mobileNo: (item) => (
                  <td>
                    {item.mobileNo}
                  </td>
                ),
                email: (item) => (
                  <td>
                    {item.email}
                  </td>
                ),
                userName: (item) => (
                  <td>
                    {item.userName}
                  </td>
                ),
                baseSalary: (item) => (
                  <td>
                    <b>₹</b>{item.baseSalary}
                  </td>
                ),
                show_delete: (item,index) => {
                  return (
                    // <td className="py-2">
                    //   <CButton
                    //     color="primary"
                    //     variant="outline"
                    //     shape="square"
                    //     size="sm"
                    //     onClick={() => {
                    //       toggleDetails(item.id);
                    //     }}
                    //   >
                    //     {details.includes(item.id) ? "Hide" : "Show"}
                    //   </CButton>
                    // </td>
                    <td>
                      <CInputGroup style={{flexWrap: "nowrap"}}>
                              <CButton style={{ color: "#fff",backgroundColor: "#007bff",borderColor: "#007bff", borderRadius:"0.25rem", marginRight:"5px" }} type="button" color="secondary" variant="outline"onClick={() => edit(item,index)}>Edit</CButton>
                              <CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545", borderRadius:"0.25rem" }} type="button" color="secondary" variant="outline" onClick={() => deleteVideo(item.id)} >Delete</CButton>
                           </CInputGroup>
                           <br></br>
                            
                              <CInputGroup
                                style={{
                                  flexWrap: "nowrap",
                                  marginTop: "-15px",
                                }}
                              >
                                <CButton
                                  style={{ color: "#333",backgroundColor: "#00000000",borderColor: "#c7c6c6", borderRadius:"0.25rem", marginRight:"5px" }}
                                  //   color: "#333",
                                  //   backgroundColor: "#00000000",
                                  //   borderColor: "#c7c6c6",
                                  //   borderRadius: "0.25rem",
                                  //   marginRight: "5px",
                                    
                                  // }}
                                  type="button"
                                  color="secondary"
                                  variant="outline"
                                  onClick={() => addSalary(item, item.id)}
                                >
                                  Add Salary
                                </CButton>
                                <CButton
                                  style={{
                                    color: "#333",
                                    backgroundColor: "#00000000",
                                    borderColor: "#c7c6c6",
                                    borderRadius: "0.25rem",
                                  }}
                                  type="button"
                                  color="secondary"
                                  variant="outline"
                                  onClick={() => hist(item, item.id)}
                                >
                                  View History
                                </CButton>
                              </CInputGroup>
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
              // pagination
              // tableFilter
              sorter
              // itemsPerPageSelect
              // itemsPerPage={30}
              clickableRows
              //   onRowClick={(item) => history.push(`/users/${item.id}`)}
            />
          </CCardBody>
        </CCard>
      </CCol>

      {/* <CCol xl={1} /> */}
    </CRow>
  );
};

export default BlogsPage;

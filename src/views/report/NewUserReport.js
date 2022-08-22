import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CInput,
  CInputGroup,
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { exportDataToXLSX } from "../../utils/exportData";
import jsPDF from "jspdf";
import "jspdf-autotable";

const NewUserReport = () => {
  const history = useHistory();

  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const socData = new Date().setHours(0,0,0,0) - (30*(24 * 60 * 60 * 1000));
  const curData = new Date().setHours(23,59,59,999);
  var[order, setOrder] = useState(socData);
  var[porder, setPorder] = useState(curData);

  var [state, setState] = useState({
    users: null,
  });
  const [status, setStatus] = useState("");

    useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    setLoading(true);
    const users = await firebase
      .firestore()
      .collection("users")
      .where("timeStamp", ">=", order)
      .where("timeStamp", "<=", porder)
      .get();

    const resolvedUsers = users.docs.map((user) => {
      const id = user.id;
      const userData = user.data();

      return {
        ...userData,
        id: id,
        ddate: new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(userData.timeStamp),
        date: userData.timeStamp,
        name: userData.name,
        phno:userData.mobile,
        fno:userData.flatNo,
        wing: userData.wing,
        soc: userData.societyName,
        type:userData.userType
      };
    });
    setState({
      ...state,
      users: resolvedUsers,
    });
    // setData(resolvedUsers)
    setLoading(false);
  };
  const onExportData = async (e) => {
    // state.porder= cat;
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
        name: item.name,
        phno:item.phno,
        fno:item.fno,
        soc: item.soc,
        wing: item.wing,
        type:item.type,
      }));

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
  
    const title = "User List";
    const headers = [
      ["Customer Details","Phone No","Flat No","Society Name","wing","User Type"],
    ];
  
    const data = e.map((elt) => 
    [
      elt.name  ,
      elt.phno,
      elt.fno,
      elt.soc,
      elt.wing,
      elt.type,
       
  ]);
  
    let content = {
      startY: 50,
      head: headers,
      body: data,
      // content:charge,
      // foot:footer
    };
    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("userList.pdf");
  };
  const onChangeDate =  (e) => {
    porder=new Date(document.getElementById("date-to").value).setHours(23,59,59,999);
    order=new Date(document.getElementById("date-from").value).setHours(0,0,0,0);
    // getUsers();
    getUsers();
    // getVideos();
  };

  return (
    <CRow>
      {/* <CCol xl={1} /> */}
      <CCol>
        <CCard>
          <CCardHeader
            className="d-flex justify-content-between align-items-center"
            style={{
              fontWeight: "bold",
              backgroundColor: "#f7f7f7",
              fontSize: "1.1rem",
              color: "black",
            }}
          >
              <CCol sm="3">
                    <div className="font-xl">New User Reports</div>
                </CCol>
                <CCol sm="1">
                    <div style={{width:"160px",marginLeft:"5px"}}>
                        From:
                        <span><CInput type="date" id="date-from" name="date-input" placeholder="date"/></span>
                    </div>
                </CCol>
                <CCol sm="1">
                    <div style={{width:"160px",marginLeft:"5px"}}>
                        To:
                        <span><CInput type="date" id="date-to" name="date-input" placeholder="date" onChange={() => onChangeDate()}/></span>   
                    </div>
                </CCol>
                <CCol sm="2">
                    <div>
                        <CButton
                            color="info"
                            className="mr-3"
                            onClick={() => onExportData()}
                        >
                            Export Data
                        </CButton>
                    </div>
                </CCol>
          </CCardHeader>
          <CCardBody>
              <CRow>
              <CDataTable style={{border:"1px solid #ebedf0"}}
              loading={loading}
              onColumnFilterChange={(e) => {
                setTableFilters(e);
              }}
              onSorterValueChange={(e) => {
                // console.log(e);
              }}
              onTableFilterChange={(filter) => setTableFilters(filter)}
              items={state.users}
              fields={[
                { key: "srno", label: "Sr. No.", filter: true },
                { key: "type", label: "User Type", filter: true },
                { key: "ddate", label: "Registration Date", filter:true},
                { key: "name", label: "Username", filter: true },
                { key: "phno", label: "Phone Number", filter: true },
                { key: "fno", label: "Flat No", filter: true },
                { key: "wing", label: "Wing", filter: true },
                { key: "soc", label: "Society", filter: true },
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
                type: (item) => (
                  <td>
                    {item.type}
                  </td>
                ),
                 
                ddate: (item) => {
                    return (
                    <td>
                        <div>{item.ddate}</div>
                        <div>
                            {new Intl.DateTimeFormat("en-US", {
                            hour: "numeric",
                            minute: "numeric",
                            }).format(item.date)}
                        </div>
                    </td>
                    );
                },
                name: (item) => (
                  <td>
                    <div>{item.name}</div>
                    <div>{item.phno}</div>
                  </td>
                ),
                phno: (item) => (
                  <td>
                    <div>{item.phno}</div>
                  </td>
                ),
                fno: (item) => (
                  <td>
                    {item.fno}
                  </td>
                ),
                wing: (item) => (
                  <td>
                    {item.wing}
                  </td>
                ),
                soc: (item) => (
                  <td>
                    {item.soc}
                  </td>
                ),
                show_delete: (item,index) => {
                  return (
                    <td>
                      <CInputGroup style={{flexWrap: "nowrap"}}>
                              {/* <CButton style={{ color: "#fff",backgroundColor: "#007bff",borderColor: "#007bff", borderRadius:"0.25rem", marginRight:"5px" }} type="button" color="secondary" variant="outline" onClick={() => hist(item)}>View History</CButton> */}
                              {/* <CButton style={{ color: "#fff",backgroundColor: "#00BFFF",borderColor: "#00BFFF", borderRadius:"0.25rem" }} type="button" color="secondary" variant="outline" onClick={() => edit(item,index)}>Update User</CButton> */}
                              
                           </CInputGroup>
                    </td>
                  );
                },
              }}
              hover
                striped
                columnFilter
                sorter
                pagination
                itemsPerPage={30}
                clickableRows
            />
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default NewUserReport;
import { CircularProgress, TableCell, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { CryptoList } from "../../../config/chart/api";
import { useDash } from "../../../contexts/DashContext";
import {
  SidePagination,
  SideTableBody,
  SideTableRow,
  TextContent,
  TextWrapper,
} from "../../../styles/dashboard/DashTable";
import { ContainerSidebar } from "../../../styles/dashboard/Global";

const DashTable = ({ currency, selectedCoin, setSelectedCoin }) => {
  const [coins, setCoins] = useState();
  //eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const searchCoinRef = useRef();
  const {
    userDataCollection,
    keysPressed,
    setKeysPressed,
    setCoinsAccessed,
    accessedCoins,
    setAccessedCoins,
    continuousAuthentication,
  } = useDash();

  const fetchCoins = async () => {
    setLoading(true);
    const { data } = await axios.get(CryptoList(currency));
    setCoins(data);
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    const keyCode = e.keyCode;
    const input = searchCoinRef.current.value;
    if (input === "" && keyCode === 8) {
      return;
    } else {
      setKeysPressed(keysPressed + 1);
    }
    // console.log(keysPressed, keyCode);
  };

  useEffect(() => {
    fetchCoins();
    //eslint-disable-next-line
  }, [currency]);

  useEffect(() => {
    const userSelectedCrypto = localStorage.getItem("selectedCrypto");
    const userSelectedPage = localStorage.getItem("selectedPage");
    setSelectedCoin(userSelectedCrypto);
    setPage(userSelectedPage);
    // console.log("Coins Accessed: " + coinsAccessed);
    //eslint-disable-next-line
  }, [selectedCoin]);

  const handleSearch = () => {
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search) ||
        coin.symbol.toLowerCase().includes(search)
    );
  };

  return (
    <>
      <ContainerSidebar>
        {!coins ? (
          <CircularProgress
            style={{ color: "rgba(36, 44, 92)" }}
            size={50}
            thickness={2}
          />
        ) : (
          <>
            <TextField
              label="Search"
              variant="standard"
              color="primary"
              style={{
                width: "60%",
              }}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (userDataCollection || continuousAuthentication) {
                  handleKeyDown(e);
                } else return;
              }}
              inputRef={searchCoinRef}
            />
            <SideTableBody>
              {handleSearch()
                .slice((page - 1) * 5, (page - 1) * 5 + 5)
                .map((row) => {
                  return (
                    <>
                      <SideTableRow
                        selected={row.id === selectedCoin ? true : false}
                        onClick={() => {
                          setSelectedCoin(row.id);
                          localStorage.setItem("selectedCrypto", row.id);
                          if (userDataCollection || continuousAuthentication) {
                            if (!accessedCoins.includes(row.id)) {
                              setAccessedCoins((oldArray) => [
                                ...oldArray,
                                row.id,
                              ]);
                              setCoinsAccessed(accessedCoins.length);
                            }
                          }
                        }}
                        key={row.name}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          style={{
                            display: "table-caption",
                            gap: 15,
                            color: "black",
                            cursor: "pointer",
                            marginLeft: "10px",
                          }}
                        >
                          <img src={row?.image} alt={row.name} height="70" />
                          <TextWrapper>
                            <TextContent>{row.name}</TextContent>
                          </TextWrapper>
                        </TableCell>
                      </SideTableRow>
                    </>
                  );
                })}
            </SideTableBody>
            <SidePagination
              count={(handleSearch()?.length / 5).toFixed(0)}
              size="small"
              defaultPage={1}
              siblingCount={0}
              onChange={(_, value) => {
                setPage(value);
                localStorage.setItem("selectedPage", value);
              }}
            />
          </>
        )}
      </ContainerSidebar>
    </>
  );
};

export default DashTable;

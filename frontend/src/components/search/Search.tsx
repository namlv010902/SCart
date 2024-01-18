import { Drawer, Input,Spin } from 'antd'
import React, { useState, useEffect } from 'react'
import { CiSearch } from 'react-icons/ci'
import "./search.css"
import { NavLink } from 'react-router-dom'
import { scrollToTop } from '../../config/scrollToTop'
import { useSearchProductMutation } from '../../service/product.service'

const Search = () => {
    const [open, setOpen] = useState(false);
    const [show, setShow] = useState(false);
    const [searchData, setSearchData] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [search, { data: dataSearch, isLoading }] = useSearchProductMutation();
    const [debouncedSearchValue, setDebouncedSearchValue] = useState("");

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        setSearchData(dataSearch?.data?.docs)
        console.log(dataSearch);
    }, [dataSearch])

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchValue(searchValue);
        }, 500);
        return () => {
            clearTimeout(timer);
        };
    }, [searchValue]);

    useEffect(() => {
        if (debouncedSearchValue) {
            search(debouncedSearchValue);
            setShow(true);
        } else {
            setShow(false);
        }
    }, [debouncedSearchValue]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
    };

    const ShowSearch = (): JSX.Element | null => {
        if (show) {
            return (
                <div className='show-search'>
                    <p>Result search: </p>
                    {searchData?.length > 0 ? (
                        <>
                            {searchData?.map((item: any) => {
                                return (
                                    <div className='show-search-item'>
                                        <NavLink to={"products/" + item._id} onClick={() => {
                                            onClose();
                                            scrollToTop();
                                        }}>
                                            <div className="search-item-img">
                                                <img src={item.image} alt="" />
                                            </div>
                                            <div className="search-item-body">
                                                <p>{item.name}</p>
                                                <strong>${item.price}</strong>
                                            </div>
                                        </NavLink>
                                    </div>
                                );
                            })}
                        </>
                    ) : (
                        <p>Not found product</p>
                    )}
                </div>
            );
        }

        return null;
    };

    return (
        <div className="search" style={{ cursor: "pointer" }}>
            <CiSearch onClick={showDrawer} style={{ fontSize: "30px", margin: "0 15px" }} />
            <Drawer placement="top" onClose={onClose} open={open}>
                <Input placeholder="Search..." onChange={handleInputChange} />
                {isLoading ? (
                   <Spin/>
                ) : (
                    <ShowSearch />
                )}
            </Drawer>
        </div>
    );
}

export default Search;
import { Layout, Spin } from "antd";
import Login from "./Login";
import { Outlet } from "react-router-dom";
import useGlobalStore from "src/store/globalStore";
import React from "react";

const {Header} = Layout
const HeaderStyle:React.CSSProperties = {
    textAlign: "center",
    paddingInline: 10,
    height: 64,
    lineHeight: "64px",
    color: "#fff",
    backgroundColor: "black",
}
export default function RequireAuth() {
    const loading = useGlobalStore((state) => state.loading)
    return (
        <Layout>
            {loading &&( 
                <div>
                    <Spin size="large" ></Spin>
                </div>
            )
            }
            <Header style={HeaderStyle}>
                <Login />
            </Header>
            <Outlet />
        </Layout>
    )
}
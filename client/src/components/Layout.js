import React, { useState } from 'react';
import SideBar from './SideBar';
import styled from 'styled-components';

const MainContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: #DDD;
  color: #76885B;
`;

const ContentContainer = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  transition: margin-left 0.3s ease;
  background-color: #DDD;
  color: #EEE;
  ${({ isSidebarCollapsed }) => isSidebarCollapsed ? 'margin-left: 80px;' : 'margin-left: 250px;'}
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Layout = ({ children }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <MainContainer>
            <SideBar isCollapsed={isSidebarCollapsed} onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
            <ContentContainer isSidebarCollapsed={isSidebarCollapsed}>
                {children}
            </ContentContainer>
        </MainContainer>
    );
};

export default Layout;

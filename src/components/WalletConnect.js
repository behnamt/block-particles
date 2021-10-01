import { useWeb3React } from '@web3-react/core';
import styled from 'styled-components';
import {injected} from '../web3/connectors';

const StyledButton = styled.button`
    width: 150px;
    height: 60px;
    box-shadow: #525252 6px 6px;
    cursor: pointer;
    background: #969696;
`;
function WalletConnect() {

  const { activate} = useWeb3React();

  return (

    <StyledButton onClick={() => activate(injected)}>
      Connect!
    </StyledButton>
  );
}

export default WalletConnect;
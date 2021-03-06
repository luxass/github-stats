import styled from "styled-components";

const StyledButton = styled.a`
    margin-top: 3rem;
    text-decoration: none;
    color: #fff;
    background-color: #00a36c;
    border-color: #00a36c;
    display: inline-block;
    font-weight: 400;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    border: 1px solid transparent;
    border-top-color: transparent;
    border-right-color: transparent;
    border-bottom-color: transparent;
    border-left-color: transparent;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: 0.25rem;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
        border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
`;

type RedirectButtonProps = {
    goTo: string;
    children: React.ReactNode;
};

export default function RedirectButton({
    goTo,
    children,
}: RedirectButtonProps) {
    return (
        <StyledButton href={goTo} target="_blank">
            {children}
        </StyledButton>
    );
}

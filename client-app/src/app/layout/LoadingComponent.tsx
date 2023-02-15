import React from "react";
import { Dimmer, Header, Loader } from "semantic-ui-react";
import { Oval } from  'react-loader-spinner'


interface Props {
    inverted?: boolean;
    content?: string;
}
export default function LoadingComponent({ inverted = true, content = "Loadind..." }: Props) {
    console.debug()
    return (
        <Dimmer active={true} inverted={inverted}>
            <Oval
                height={80}
                width={80}
                color="#808080"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel='oval-loading'
                secondaryColor="#c0c0c0"
                strokeWidth={2}
                strokeWidthSecondary={2}
            />
            <Header>{content}</Header>
        </Dimmer>
    )
}

{
    "from" : "esp",
        "to" : "bridge",
            "Left_bar" : "up/down",
                "right_bar": "up/down",
                    "left_bar2": "up/down",
                        "right_bar2"  : "up/down",
                            "gyroscope" : "1-100",
                                "Luncher_State" : "OFF(Repos) / TIRER / LACHER  ",
                                    "Luncher_Strong" : "0 - 100",
                                        "Start" : "down / up",
                                            "redButton" : "down/ up",
                                                "whiteButton" : "down/ up",
                                                    "blueButton" : "down / up "
}

// BRIDGE TO ESP

{
    "Solonoide_activate" : "#ID (de 1 à 6 ) ",
}

//////////////////////////////////////////////////////////////////////////

// Bridge/Server   to   PinBall

{
    "from" : "server",
        "to" : "Pinball",
            "Left_bar" : "up/down",
                "right_bar": "up/down",
                    "left_bar2": "up/down",
                        "right_bar2"  : "up/down",
                            "gyroscope" : "1-100",
                                "Luncher_State" : "OFF / TIRER / LACHER  ",
                                    "Luncher_Strong" : "0 - 100",
                                        "Start" : "down / up",
                                            "redButton" : "down/ up",
                                                "whiteButton" : "down/ up",
                                                    "blueButton" : "down / up ",

}

// PinBAll to SERVER 
{
    "Solonoide_activate" : "#ID (de 1 à 6 ) ",
}

// PinBALL to BACkGLASS 

{
    "Animation" : "1 or 2 or 3 ",
        "Applaudition" : "1 /2 / 3 ",
            "Encourageemnt" : "1,3,2",
                "Hall_of_Fame" : "[
    'first' : 500,
        'second' : 30
    ]",

}

// PinBall to DMD 

{
    "GameOver" : "1 / 0 "
}
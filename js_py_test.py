import json # import the module of json
import sys # this module is used to get the params from cmd
import RPi.GPIO as gpio

def execute_opt(opt):
    return 0

def gpio_init(pin):

    gpio.setmode(gpio.BCM)
    gpio.setup(pin, gpio.OUT)

def gpio_out_set(pin, mode):

    if mode == "on":
        gpio.output(pin, gpio.LOW)
    else:
        gpio.output(pin, gpio.HIGH)


def main():

    opt = sys.argv[1]
    #print("opt is " + opt)

    status = 'success'

    chnl_1_pin = 17

    gpio_init(chnl_1_pin)
    gpio_out_set(chnl_1_pin, opt)
    
    if execute_opt(opt) != 0:
        status = 'fail'

    #obj = json.loads(params) #str to obj
    ret_json = {"option":opt, "status":status}
    ret_str = json.dumps(ret_json,sort_keys=True)

    #return strjson to js
    print(ret_str)

main()

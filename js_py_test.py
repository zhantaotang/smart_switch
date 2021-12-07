import json # import the module of json
import sys # this module is used to get the params from cmd
import time
import RPi.GPIO as gpio


def execute_opt(opt):
    return 0

def gpio_init(pin):

    gpio.setmode(gpio.BCM)
    gpio.setup(pin, gpio.OUT)

def gpio_out_set(pin, mode):

    gpio.output(pin, mode)


def power_action(pin, opt):

    if opt == "on":
        gpio_out_set(pin, gpio.LOW)
    
    elif opt == "off":
        gpio_out_set(pin, gpio.HIGH)

    else: # reset
        # first power off
        gpio_out_set(pin, gpio.HIGH)

        #sleep for 5 seconds for power off
        time.sleep(3)

        # then power on
        gpio_out_set(pin, gpio.LOW)


def main():

    chnl = sys.argv[1]
    opt = sys.argv[2]
    #print("opt is " + opt)

    status = 'success'

    chnl_pin = 0

    if chnl == "1":
        chnl_pin = 17
    elif chnl == "2":
        chnl_pin = 23
    else:
        status = 'fail with invalid chnl'
        ret_json = {"chnl":chnl, "option":opt, "status":status}
        ret_str = json.dumps(ret_json,sort_keys=True)
        print(ret_str)
    
        return

    gpio_init(chnl_pin)
    power_action(chnl_pin, opt)
    
    if execute_opt(opt) != 0:
        status = 'fail'

    #obj = json.loads(params) #str to obj
    ret_json = {"chnl":chnl, "option":opt, "status":status}
    ret_str = json.dumps(ret_json,sort_keys=True)

    #return strjson to js
    print(ret_str)

main()

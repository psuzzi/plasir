package tracebite;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;

/**
 * A simple Swing application with a menu bar.
 */
public class SwingApp {
    private JFrame frame;

    public SwingApp() {
        // Create the main frame
        frame = new JFrame("TracebitApp");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(800, 600);
        
        // Create menu bar
        JMenuBar menuBar = new JMenuBar();
        
        // Create File menu
        JMenu fileMenu = new JMenu("File");
        fileMenu.setMnemonic(KeyEvent.VK_F);
        
        // Create Close menu item
        JMenuItem closeMenuItem = new JMenuItem("Close", KeyEvent.VK_C);
        closeMenuItem.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_F4, ActionEvent.ALT_MASK));
        closeMenuItem.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                System.exit(0);
            }
        });
        
        // Add menu items to the menu
        fileMenu.add(closeMenuItem);
        
        // Add menu to the menu bar
        menuBar.add(fileMenu);
        
        // Set the menu bar to the frame
        frame.setJMenuBar(menuBar);
        
        // Add a simple panel with a welcome message
        JPanel panel = new JPanel();
        panel.setLayout(new BorderLayout());
        JLabel welcomeLabel = new JLabel("Welcome to Tracebite Application", SwingConstants.CENTER);
        welcomeLabel.setFont(new Font("Arial", Font.BOLD, 24));
        panel.add(welcomeLabel, BorderLayout.CENTER);
        frame.getContentPane().add(panel);
        
        // Center the frame on the screen
        frame.setLocationRelativeTo(null);
    }
    
    public void show() {
        // Show the frame
        frame.setVisible(true);
    }
    
    public static void main(String[] args) {
        // Use the event dispatch thread for Swing operations
        SwingUtilities.invokeLater(new Runnable() {
            @Override
            public void run() {
                SwingApp app = new SwingApp();
                app.show();
            }
        });
    }
} 